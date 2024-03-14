import JSONExplorer from './JSONExplorer';

const data = {
  "date": "2021-10-27T07:49:14.896Z",
  "hasError": false,
  "fields": [
    {
      "id": "4c212130",
      "prop": "iban",
      "value": "DE81200505501265402568",
      "hasError": false
    }
  ]
};

// const exampleJson = {
//   "glossary": {
//     "title": "example glossary",
//     "GlossDiv": {
//       "title": "S",
//       "GlossList": {
//         "GlossEntry": {
//           "ID": "SGML",
//           "SortAs": "SGML",
//           "GlossTerm": "Standard Generalized Markup Language",
//           "Acronym": "SGML",
//           "Abbrev": "ISO 8879:1986",
//           "GlossDef": {
//             "para": "A meta-markup language, used to create markup languages such as DocBook.",
//             "GlossSeeAlso": ["GML", "XML"]
//           },
//           "GlossSee": "markup"
//         }
//       }
//     }
//   }
// }

function App() {

  return (
    <>
      <JSONExplorer data={data} />
    </>
  )
}

export default App
