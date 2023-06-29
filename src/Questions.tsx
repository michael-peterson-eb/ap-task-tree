import React, { useCallback, useState, FC, useEffect } from 'react';


interface QuestionsProps {
   message: string;
}

interface Wisdom {
   categories: [],
   created_at: string,
   icon_url: string,
   id: string,
   updated_at: string,
   url: string,
   value: string
}

const Questions = ({ message }) => {
   const [count, setCount] = useState(0);
   const [questionTypes, setQuestionTypes] = useState([]);

   const increment = useCallback(() => {
      setCount(count => count + 1);
   }, [count]);

   const querySelect = (query: any, maxRows = 100) => {
    return new Promise((resolve, reject) => {
      rbf_selectQuery(query, maxRows, function(values: any) {
          resolve(values);
      })
    });
   };

  const fieldsGet = (objName: string, id: string, fields: string, useLegacyDateFormat = null, options = null) => {
    return new Promise((resolve, reject) => {
      rbf_getFields(objName, id, fields, function (objName: string, objId: string, values: any) {
          resolve({objName: objName, objId: objId, values: values});
      }, useLegacyDateFormat, options);
    });
  };

  const Question = (prop) => {
    return(
      <ul>
        {prop.qtypes.map((q) => {
          return (
            <li key={q.id}>{q.name}</li>
          )
        })}
      </ul>
    )
  }

  useEffect(() => {
    (async () => {
      const qTypes = await _RB.selectQuery(['id', 'name'],'EA_SA_AssessmentQuestionType', true, 1000, true);
      setQuestionTypes(qTypes);
    })();
  }, [count]);

  return (
    <>
    <h3>{message}</h3>
    <h4>Wisdom # {count}</h4>
    <button onClick={increment}>More</button>
    <br />
    <Question qtypes={questionTypes}/>
    </>
  );

};

export default Questions;
