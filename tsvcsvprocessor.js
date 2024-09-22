const container = document.createElement('div');
document.body.appendChild(container);

const fileInput = document.createElement('input');
fileInput.type = 'file';
container.appendChild(fileInput);

const fileTypeSelect = document.createElement('select');
fileTypeSelect.innerHTML = `
  <option value="csv">CSV</option>
  <option value="tsv">TSV</option>
`;
container.appendChild(fileTypeSelect);

const filterTypeSelect = document.createElement('select');
filterTypeSelect.innerHTML = `
  <option value="include">Include lines with word</option>
  <option value="exclude">Exclude lines with word</option>
`;
container.appendChild(filterTypeSelect);

const filterWordInput = document.createElement('input');
filterWordInput.type = 'text';
filterWordInput.placeholder = 'Enter filter word';
container.appendChild(filterWordInput);

const processButton = document.createElement('button');
processButton.textContent = 'Process File';
container.appendChild(processButton);

// Main processing function
async function processFile() {
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file');
        return;
    }

    const fileType = fileTypeSelect.value;
    const filterType = filterTypeSelect.value;
    const filterWord = filterWordInput.value.trim();

    if (!filterWord) {
        alert('Please enter a filter word');
        return;
    }

    try {
        const writer = await getFileWriter(`processed_${file.name}`);
        const linesProcessed = await processFileInChunks(file, writer, fileType, filterType, filterWord);
        console.log(`Processed ${linesProcessed} lines. File saved.`);
    } catch (error) {
        console.error('Error processing file:', error);
    }
}

async function getFileWriter(filename) {
    const options = {
        types: [{
            description: 'CSV/TSV file',
            accept: { 'text/csv': ['.csv', '.tsv'] },
        }],
        suggestedName: filename,
    };
    const handle = await window.showSaveFilePicker(options);
    return await handle.createWritable();
}

async function processFileInChunks(file, writer, fileType, filterType, filterWord) {
    const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
    const fileStream = file.stream();
    const reader = fileStream.getReader();

    let buffer = '';
    let linesProcessed = 0;
    let processedChunk = '';
    const delimiter = fileType === 'csv' ? ',' : '\t';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += new TextDecoder().decode(value);
            let lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer

            processedChunk = '';
            for (const line of lines) {
                const shouldInclude = filterType === 'include' ? line.includes(filterWord) : !line.includes(filterWord);
                if (shouldInclude) {
                    processedChunk += line.trim() + '\n';
                    linesProcessed++;
                }
            }

            if (processedChunk) {
                await writer.write(processedChunk);
            }
        }

        // Process the last line if it's not empty
        if (buffer) {
            const shouldInclude = filterType === 'include' ? buffer.includes(filterWord) : !buffer.includes(filterWord);
            if (shouldInclude) {
                await writer.write(buffer.trim() + '\n');
                linesProcessed++;
            }
        }
    } finally {
        reader.releaseLock();
        await writer.close();
    }

    return linesProcessed;
}

// Event listener for the process button
processButton.addEventListener('click', processFile);