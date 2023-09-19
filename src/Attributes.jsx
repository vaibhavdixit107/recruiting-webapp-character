import React, { useEffect, useState } from "react";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "./consts";
import { saveCharacter, getCharacter } from "./CharacterAPI";

function CharacterSheet(){

    const calculateAbilityModifier = (value) => {
      return Math.floor((value - 10) / 2);
    };

    const [attributes, setAttributes] = useState({
        Strength: 10,
        Dexterity: 10,
        Constitution: 10,
        Intelligence: 10,
        Wisdom: 10,
        Charisma: 10
    })

    const [selectedClass, setSelectedClass] = useState(null);

    const [skillPoints, setSkillPoints] = useState(
      10 + 4 * calculateAbilityModifier(attributes.Intelligence )
    )
    
    const handleIncrement = (attribute) => {
      setAttributes((prevAttributes) => {
        const updatedAttributes = { ...prevAttributes };
        const newValue = updatedAttributes[attribute] + 1;
        // Ensure the new value does not exceed the maximum of 70
        updatedAttributes[attribute] = Math.min(newValue, 70);
        return updatedAttributes;
      });
    };
    
    const handleDecrement = (attribute) => {
      setAttributes((prevAttributes) => {
        const updatedAttributes = { ...prevAttributes };
        const newValue = updatedAttributes[attribute] - 1;
        // Ensure the new value does not go below the minimum of 1
        updatedAttributes[attribute] = Math.max(newValue, 1);
        return updatedAttributes;
      });
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

      const handleSkillIncrement = (skillName) => {
        if (skillPoints > 0) {
          setSkills((prevSkills) => {
            const newSkills = { ...prevSkills };
            if (newSkills[skillName].points < skillPoints) {
              newSkills[skillName].points += 1;
              newSkills[skillName].total = calculateSkillTotal(
                skillName,
                newSkills[skillName].points
              );
              setSkillPoints(skillPoints - 1);
            }
            return newSkills;
          });
        }
      };
    
      const handleSkillDecrement = (skillName) => {
        if (skills[skillName].points > 0) {
          setSkills((prevSkills) => {
            const newSkills = { ...prevSkills };
            newSkills[skillName].points -= 1;
            newSkills[skillName].total = calculateSkillTotal(
              skillName,
              newSkills[skillName].points
            );
            setSkillPoints(skillPoints + 1);
            return newSkills;
          });
        }
      };
    
      const calculateSkillTotal = (skillName, points) => {
        const skill = SKILL_LIST.find((s) => s.name === skillName);
        const abilityModifier = calculateAbilityModifier(
          attributes[skill.attributeModifier]
        );
        return points + abilityModifier;
      };
    
      const [skills, setSkills] = useState(
        SKILL_LIST.reduce((skillObj, skill) => {
          skillObj[skill.name] = {
            points: 0,
            modifier: skill.attributeModifier,
            total: calculateSkillTotal(skill.name, 0)
          };
          return skillObj;
        }, {})
      );

      useEffect(() => {
        async function loadCharacterData() {
          try{
            const characterData = await getCharacter('vaibhavdixit107')
          }catch(err){
            console.log(err)
          }
        }
        loadCharacterData()
      },[])

      const handleSaveCharacter = async () =>{
        try{
          const characterDataToSave = {
            attributes,
            selectedClass,
            skills
          }
          const savedCharacters = await saveCharacter('vaibhavdixit107', characterDataToSave)
        }catch(err){
          console.log('HandleSaveCharacterData:',err)
        }
      }
    
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
           <h1>Skills</h1>
      <div>
      {SKILL_LIST.map((skill) => (
          <div key={skill.name}>
            <p>
              {skill.name} - points: {skills[skill.name].points}{' '}
              <button onClick={() => handleSkillIncrement(skill.name)}>+</button>
              <button onClick={() => handleSkillDecrement(skill.name)}>-</button>
              modifier ({skill.attributeModifier}):{' '}
              {calculateAbilityModifier(attributes[skill.attributeModifier])} total:{' '}
              {skills[skill.name].total}
            </p>
          </div>
        ))}
      </div>
        </div>
      ); 
}

export default CharacterSheet;