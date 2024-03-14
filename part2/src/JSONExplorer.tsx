import React, { useState, useCallback, useContext, useMemo, createContext } from 'react';

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

interface JSONExplorerProps {
  data: { [key: string]: JSONValue };
}

// use context to avoid prop drilling
const PathContext = createContext<(path: string) => void>(() => { });

const JSONExplorer: React.FC<JSONExplorerProps> = ({ data }) => {
  const [inputPath, setInputPath] = useState<string>('');
  const [highlightedValue, setHighlightedValue] = useState<string>('');

  // useCallback ensures these functions are memoized. This prevents unnecessary re-renders 
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = event.target.value;
    setInputPath(newPath);
    const result = findValueByPath(newPath, data);
    setHighlightedValue(result !== undefined ? JSON.stringify(result, null, 2) : 'Path does not exist');
  }, [data]);

  const handlePathSelected = useCallback((path: string) => {
    setInputPath(path);
    const result = findValueByPath(path, data);
    setHighlightedValue(result !== undefined ? JSON.stringify(result, null, 2) : 'Path does not exist');
  }, [data]);

  // useMemo prevents unnecessary re-renders
  const providerValue = useMemo(() => handlePathSelected, [handlePathSelected]);

  return (
    <>
      <input
        type="text"
        value={inputPath}
        onChange={handleInputChange}
        placeholder="Enter path (e.g., res.fields[0].id)"
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <pre style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
        <PathContext.Provider value={providerValue}>
          <JSONNode data={data} parentPath="res" />
        </PathContext.Provider>
      </pre>
      <div>
        <p>Path: {inputPath}</p>
        <p>Value: {highlightedValue}</p>
      </div>
    </>
  );
};

const JSONNode: React.FC<{ data: JSONValue; parentPath: string }> = React.memo(({ data, parentPath }) => {

  // context allows us to access the closest current value of PathContext
  const onPathSelected = useContext(PathContext);

  if (Array.isArray(data)) {
    return <>[{data.map((item, index) => <JSONNode key={index} data={item} parentPath={`${parentPath}[${index}]`} />)}]</>;
  }

  if (typeof data === 'object' && data !== null) {
    return (
      <>{'{'}
        {Object.entries(data).map(([key, value], index, arr) => (
          <div key={key} style={{ paddingLeft: '20px' }}>
            <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => onPathSelected(`${parentPath}.${key}`)}>
              "{key}":
            </span>
            <span style={{ marginLeft: '5px' }}>
              {typeof value === 'object' ? <JSONNode data={value} parentPath={`${parentPath}.${key}`} /> : ` ${JSON.stringify(value)}`}
            </span>
            {index < arr.length - 1 && ','}
          </div>
        ))}
        {'}'}</>
    );
  }

  return <>{JSON.stringify(data)}</>;
});

const findValueByPath = (inputPath: string, data: any): any => {
  // Remove 'res.' prefix from inputPath
  const pathWithoutResPrefix = inputPath.replace(/^res\./, '');

  // Split a string path like 'fields[0].id' into an array of segments: ['fields', '0', 'id'].
  const segments = pathWithoutResPrefix.split(/\.|\[|\]/).filter(Boolean);

  // Traverse the data object using the segments. Start with the full data object and, for each segment,
  // move one level deeper into the object or array. If a segment isn't found, return 'undefined'.
  return segments.reduce((acc, segment) => acc && typeof acc === 'object' ? acc[segment] : undefined, data);
};

export default JSONExplorer;

