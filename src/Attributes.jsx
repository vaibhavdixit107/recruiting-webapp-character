import React, { useState } from "react";
import { ATTRIBUTE_LIST, CLASS_LIST } from "./consts";

function CharacterSheet(){
    const [attributes, setAttributes] = useState({
        Strength: 10,
        Dexterity: 10,
        Constitution: 10,
        Intelligence: 10,
        Wisdom: 10,
        Charisma: 10
    })

    const [selectedClass, setSelectedClass] = useState(null);
    
      const handleIncrement = (attribute) => {
        setAttributes((prevAttributes) => ({
          ...prevAttributes,
          [attribute]: prevAttributes[attribute] + 1
        }));
      };
    
      const handleDecrement = (attribute) => {
        setAttributes((prevAttributes) => ({
          ...prevAttributes,
          [attribute]: prevAttributes[attribute] - 1
        }));
      };
      const meetsClassRequirements = (className) => {
        const classRequirements = CLASS_LIST[className];
        for (const attribute in classRequirements) {
          if (attributes[attribute] < classRequirements[attribute]) {
            return false;
          }
        }
        return true;
      };

      const calculateAbilityModifier = (value) => {
        return Math.floor((value - 10) / 2);
      };
    
      return (
        <div>
          <h1>Attribute Manager</h1>
          <div>
            {ATTRIBUTE_LIST.map((attribute) => (
              <div key={attribute}>
                <h2>{attribute}</h2>
                <p>Value: {attributes[attribute]}</p>
                <p>Modifier: {calculateAbilityModifier(attributes[attribute])}</p>
                <button onClick={() => handleIncrement(attribute)}>Increment</button>
                <button onClick={() => handleDecrement(attribute)}>Decrement</button>
              </div>
            ))}
          </div>
          <h1>Available Classes</h1>
          <ul>
            {Object.keys(CLASS_LIST).map((className) => (
              <li
                key={className}
                style={{
                  color: meetsClassRequirements(className) ? 'green' : 'red',
                  fontWeight: meetsClassRequirements(className) ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedClass(className)}
              >
                {className}
              </li>
            ))}
          </ul>
          {selectedClass && (
            <div>
              <h2>Minimum Requirements for {selectedClass}</h2>
              <ul>
                {Object.keys(CLASS_LIST[selectedClass]).map((attribute) => (
                  <li key={attribute}>
                    {attribute}: {CLASS_LIST[selectedClass][attribute]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ); 
}

export default CharacterSheet;