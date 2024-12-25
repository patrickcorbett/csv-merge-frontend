import {useCallback, useEffect, useState} from 'react'
import './App.css'
import CsvFile from "./models/CsvFile.ts";
import FileDropZone from "./components/FileDropZone.tsx";
import * as CsvService from "./service/CsvService.ts";

function App() {

    const [csvFiles, setCsvFiles] = useState<CsvFile[]>([])
    const [sortDirection, setSortDirection] = useState<boolean>(true)

    async function init() {
        const files = await CsvService.getCsvFiles();
        setCsvFiles(() => {
            return [...files];
        })
    }

    useEffect(() => {
        init();
    }, []);


    const onDropHandler = useCallback(async (acceptedFiles: File[]) => {
        await CsvService.uploadFiles(acceptedFiles);
        const files = await CsvService.getCsvFiles();

        setCsvFiles(() => {
            return [...files];
        })
    }, []);

    function moveItem(files: CsvFile[], itemToMove: CsvFile, up: boolean) {
        // copy source array
        const reorderedFiles = [...files];
        const itemIndex = reorderedFiles.findIndex(file => file.name === itemToMove.name);

        // validate the item is at an index that can be moved
        if (itemIndex < 0 || itemIndex >= reorderedFiles.length) {
            return reorderedFiles;
        }

        // move up
        if (up && itemIndex > 0) {
            reorderedFiles.splice(itemIndex, 1); // Remove item that should be moved
            reorderedFiles.splice(itemIndex - 1, 0, itemToMove); // Add item at the last index - 1
        }
        if (!up && itemIndex < reorderedFiles.length) {
            reorderedFiles.splice(itemIndex, 1); // Remove item that should be moved
            reorderedFiles.splice(itemIndex + 1, 0, itemToMove); // Add item at the last index + 1
        }

        return reorderedFiles;
    }

    const moveItemUp = (csvFile: CsvFile) => {
        setCsvFiles((prevState) => {
            return moveItem(prevState, csvFile, true);
        });
    }

    const moveItemDown = (csvFile: CsvFile) => {
        setCsvFiles((prevState) => {
            return moveItem(prevState, csvFile, false);
        });
    }


    const onSortHandler = () => {

        const newSortDirection = !sortDirection;

        setCsvFiles((prevState) => {
            return prevState.sort((a, b) => {
                const compareResult = a.name.localeCompare(b.name)
                return newSortDirection ? compareResult : compareResult * -1;
            });
        });
        setSortDirection(newSortDirection);
    }

    const onMergeHandler = async () => {
        await CsvService.mergeFiles(csvFiles);
    }

    return (
        <>
            <FileDropZone onDropEvent={onDropHandler}>
            </FileDropZone>

            <div>
                {csvFiles.map((csvFile) => {
                    return (
                        <div key={csvFile.name}>{csvFile.name}
                            <button onClick={() => moveItemUp(csvFile)}>UP</button>
                            <button onClick={() => moveItemDown(csvFile)}>DOWN</button>
                        </div>
                    );
                })}
            </div>

            <button onClick={onMergeHandler}>Merge</button>
            <button onClick={onSortHandler}>Sort {sortDirection ? 'DESC' : 'ASC'}</button>
        </>
    )
}

export default App
