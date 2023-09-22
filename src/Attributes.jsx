import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts';


function calculateAbilityModifier(value) {
  return Math.floor((Number.parseInt(value, 10) || 10 - 10) / 2);
}

const githubUsername = "vaibhavdixit107"; 
const apiUrl = `https://recruiting.verylongdomaintotestwith.ca/api/${githubUsername}/character`;

const ATTRIBUTE_LIMIT = 70
function CharacterSheet() {
  const defaultAttributes = {};
    ATTRIBUTE_LIST.forEach((attribute) => {
        defaultAttributes[attribute] = 10;
    });

    const defaultSkills = {};
    SKILL_LIST.forEach((skill) => {
        defaultSkills[skill.name] = { points: 0, total: 0 }; // Set points to 0 by default
    });
    const [attributes, setAttributes] = useState(defaultAttributes); // Initialize as an empty object
    const [skills, setSkills] = useState(defaultSkills); // Initialize as an empty object
    const [skillPoints, setSkillPoints] = useState(10);
    const [selectedClass, setSelectedClass] = useState(null);
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
      // Load character data from API (replace with your API endpoint)
      axios
        .get(apiUrl)
        .then((response) => {
          const characterData = response.data;
  
          const charactersArray = Array.isArray(characterData) ? characterData : [characterData];
  
          const initialCharacters = charactersArray.map((charData, index) => {
            const initialAttributes = {};
            ATTRIBUTE_LIST.forEach((attribute) => {
              // Attributes are parsed as integers
              initialAttributes[attribute] = Number.parseInt(charData.attributes?.[attribute], 10) || 10;
            });
  
            const initialSkills = {};
            SKILL_LIST.forEach((skill) => {
              // the skill points have a default value of 10
              const skillData = charData.skills?.[skill.name] || { points: 10, total: 0 };
              initialSkills[skill.name] = {
                ...skillData,
                attributeModifier: skill.attributeModifier,
              };
            });
  
            return {
              id: index, // Assign a unique ID to each character
              attributes: initialAttributes,
              skills: initialSkills,
              selectedClass: charData.selectedClass || null,
            };
          });
  
          setCharacters(initialCharacters);
        })
        .catch((error) => {
          console.error('Error retrieving characters:', error);
        });
    }, []);

    const incrementAttribute = (attribute) => {
        if (calculateTotalAttributePoints() < ATTRIBUTE_LIMIT) {
            setAttributes((prevState) => ({
                ...prevState,
                [attribute]: (prevState[attribute] || 0) + 1,
            }));
        }
    };

    const decrementAttribute = (attribute) => {
        if (attributes[attribute] > 0) {
            setAttributes((prevState) => ({
                ...prevState,
                [attribute]: prevState[attribute] - 1,
            }));
        }
    };

    const calculateSkillTotal = (skillName, skillPoints) => {
        const skill = SKILL_LIST.find((s) => s.name === skillName);
        const abilityModifier = calculateAbilityModifier(attributes[skill.attributeModifier] || 10);
        return skillPoints + abilityModifier;
    };

    const handleSkillIncrement = (skillName) => {
        if (skillPoints > 0) {
            setSkills((prevState) => {
                const updatedSkills = {
                    ...prevState,
                    [skillName]: {
                        ...prevState[skillName],
                        points: prevState[skillName].points + 1,
                        total: calculateSkillTotal(
                            skillName,
                            prevState[skillName].points + 1
                        ),
                    },
                };
                setSkillPoints(skillPoints - 1);
                return updatedSkills;
            });
        }
    };

    const handleSkillDecrement = (skillName) => {
        if (skills[skillName]?.points > 0) {
            setSkills((prevState) => {
                const updatedSkills = {
                    ...prevState,
                    [skillName]: {
                        ...prevState[skillName],
                        points: prevState[skillName].points - 1,
                        total: calculateSkillTotal(
                            skillName,
                            prevState[skillName].points - 1
                        ),
                    },
                };
                setSkillPoints(skillPoints + 1);
                return updatedSkills;
            });
        }
    };

    const meetsClassRequirements = (className) => {
      const classRequirements = CLASS_LIST[className];
      return ATTRIBUTE_LIST.every((attribute) => attributes[attribute] >= classRequirements[attribute]);
  };

    const calculateTotalAttributePoints = () => {
        return ATTRIBUTE_LIST.reduce((total, attribute) => total + (attributes[attribute] || 0), 0);
    };

    const saveCharacter = () => {
        // Create a character object with attributes, skills, and selectedClass
        const characterData = {
            attributes,
            skills,
            selectedClass,
        };


        // Send a POST request to save the character data
        axios
            .post(apiUrl, characterData)
            .then((response) => {
                console.log('Character saved successfully:', response.data);
            })
            .catch((error) => {
                console.error('Error saving character:', error);
            });
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
              <button onClick={() => incrementAttribute(attribute)}>Increment</button>
              <button onClick={() => decrementAttribute(attribute)}>Decrement</button>
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
                cursor: 'pointer',
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
                {skill.name} - points: {skills[skill.name]?.points || 0}{' '}
                <button onClick={() => handleSkillIncrement(skill.name)}>+</button>
                <button onClick={() => handleSkillDecrement(skill.name)}>-</button>
                modifier ({skill.attributeModifier}):{' '}
                {calculateAbilityModifier(attributes[skill.attributeModifier] || 0)} total:{' '}
                {skills[skill.name]?.total || 0}
              </p>
            </div>
          ))}
        </div>
  
        <button onClick={saveCharacter}>Save Character</button>
  
        <h1>Edit Characters</h1>
        <div>
          {characters.map((character) => (
            <div key={character.id}>
              <h2>Character {character.id + 1}</h2>
              <div>
                {ATTRIBUTE_LIST.map((attribute) => (
                  <div key={attribute}>
                    <h3>{attribute}</h3>
                    <p>Value: {character.attributes[attribute]}</p>
                    <p>Modifier: {calculateAbilityModifier(character.attributes[attribute])}</p>
                  </div>
                ))}
              </div>
              <h3>Skills</h3>
              <div>
                {SKILL_LIST.map((skill) => (
                  <div key={skill.name}>
                    <p>
                      {skill.name} - points: {character.skills[skill.name]?.points || 0}
                      modifier ({skill.attributeModifier}):{' '}
                      {calculateAbilityModifier(character.attributes[skill.attributeModifier] || 0)} total:{' '}
                      {character.skills[skill.name]?.total || 0}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}

export default CharacterSheet;
