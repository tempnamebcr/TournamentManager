import React from 'react';

export default function ExperienceBar ({experience}) {
    const maxExperience = 1000;

    const experiencePercentage = (experience / maxExperience) * 100;
    const barStyles = {
        width: `${experiencePercentage}%`,
    };

    return (
        <div className="experience-bar">
            <div className="experience-bar-fill" style={barStyles}>
                <span className="experience-bar-text">{experience} / {maxExperience} XP</span>
            </div>
            <style jsx>{`
                .experience-bar {
                    margin-top:15px;
                    width: 50%;
                    height: 30px;
                    background-color: #f0f0f0;
                    border-radius: 15px;
                    overflow: hidden;
                    margin-bottom: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                .experience-bar-fill {
                    height: 100%;
                    background-color: #4caf50; /* culoarea barei de experiență */
                    border-radius: 15px;
                    transition: width 0.5s ease; /* animație pentru schimbarea lățimii */
                    display: flex;
                    align-items: center;
                }

                .experience-bar-text {
                    color: white;
                    font-weight: bold;
                    padding: 0 10px;
                    font-size: 14px;
                }
            `}</style>
        </div>
    );
};

