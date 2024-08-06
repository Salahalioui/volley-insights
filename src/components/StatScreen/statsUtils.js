// statsUtils.js

// Team Stats Calculations
// Serve Efficiency:
export const getTeamServeErrorPercentage = (game, setNumber = null) => {
  let totalServeAttempts = 0;
  let serveErrors = 0;

  const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets;

  setsToProcess.forEach((set) => {
    set.events.forEach((event) => {
      if (event.action === "serve") {
        totalServeAttempts++;
        if (event.result === "error") {
          serveErrors++;
        }
      }
    });
  });

  return totalServeAttempts > 0 ? (serveErrors / totalServeAttempts) * 100 : 0;
};

// Block Efficiency:
export const getTeamBlockErrorPercentage = (game, setNumber = null) => {
  let totalBlockAttempts = 0;
  let blockErrors = 0;
  const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets;
  
  setsToProcess.forEach((set) => {    
    set.events.forEach((event) => {    
      if (event.action === "block") {
        totalBlockAttempts++;       
        if (event.result === "error") {
          blockErrors++;         
        }
      }
    });
  });

  return totalBlockAttempts > 0 ? (blockErrors / totalBlockAttempts) * 100 : 0;
};

// Side Out Percentage:
export const getTeamSideOutPercentage = (game, setNumber = null) => {
  let sideOutPoints = 0;
  let opponentServeCount = 0;

  const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets;

  setsToProcess.forEach((set) => {
    set.events.forEach((event) => {
      if (event.servingTeam === 'opponent') {
        opponentServeCount++;
        if (event.result === 'point' && event.action !== 'serve') { // Side out point
          sideOutPoints++;
        }
      }
    });
  });

  return opponentServeCount > 0 ? (sideOutPoints / opponentServeCount) * 100 : 0;
};

// Break Point Percentage:
export const getTeamBreakPointPercentage = (game, setNumber = null) => {
  let breakPointsWon = 0;
  let teamServeCount = 0;

  const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets;

  setsToProcess.forEach((set) => {
    set.events.forEach((event) => {
      if (event.servingTeam === 'team') {
        teamServeCount++;
        if (event.result === 'point' && event.action !== 'serve') { // Break point won
          breakPointsWon++;
        }
      }
    });
  });

  return teamServeCount > 0 ? (breakPointsWon / teamServeCount) * 100 : 0;
};

// Rotation Effectiveness (Updated):
export const getTeamRotationEffectiveness = (game, setNumber = null) => {
  const rotationEffectiveness = {};
  const rotationCounts = {}; // Track the number of times each rotation occurs

  const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets;

  setsToProcess.forEach((set) => {
    set.events.forEach((event) => {
      if (event.rotation) {
        const rotationKey = event.rotation.join("-");

        if (!rotationEffectiveness[rotationKey]) {
          rotationEffectiveness[rotationKey] = { pointsScored: 0 };
          rotationCounts[rotationKey] = 0;
        }

        if (event.result === "point" && event.action !== 'serve') { 
          rotationEffectiveness[rotationKey].pointsScored++;
        }
        // Since a rotation is tied to a serve, we increment the count whenever there's a serve event
        if (event.action === "serve") { 
          rotationCounts[rotationKey]++;
        }
      }
    });
  });

  // Calculate effectiveness percentages
  for (const rotation in rotationEffectiveness) {
    rotationEffectiveness[rotation].effectiveness = 
      rotationCounts[rotation] > 0
        ? (rotationEffectiveness[rotation].pointsScored / rotationCounts[rotation]) * 100 
        : "-";
  }

  return rotationEffectiveness;
};
export const getTeamTotalPoints = (game, setNumber = null) => {
    let totalPoints = 0;
    const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets; 
    setsToProcess.forEach((set) => {
      set.events.forEach((event) => {
        if (event.result === "point") {
          totalPoints++;
        }
      });
    });
    return totalPoints;
  };
  
  export const getTeamTotalErrors = (game, setNumber = null) => {
    let totalErrors = 0;
    const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets; 
    setsToProcess.forEach((set) => {
      set.events.forEach((event) => {
        if (event.result === "error") {
          totalErrors++;
        }
      });
    });
    return totalErrors;
  };
  
  export const getTeamServeEfficiency = (game, setNumber = null) => {
    let totalServeAttempts = 0;
    let servePoints = 0;
    let serveContinues = 0;
    let serveErrors = 0;
  
    const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets; 
  
    setsToProcess.forEach((set) => {
      set.events.forEach((event) => {
        if (event.action === "serve") {
          totalServeAttempts++;
          if (event.result === "point") {
            servePoints++;
          } else if (event.result === "continue") {
            serveContinues++;
          } else if (event.result === "error") {
            serveErrors++;
          }
        }
      });
    });
  
    return totalServeAttempts > 0
      ? (servePoints + serveContinues - serveErrors) / totalServeAttempts
      : 0;
  };
  
  export const getTeamAttackEfficiency = (game, setNumber = null) => {
    let totalAttackAttempts = 0;
    let attackPoints = 0;
    let attackErrors = 0;
  
    const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets;
  
    setsToProcess.forEach((set) => {
      set.events.forEach((event) => {
        if (event.action === "spike") {
          totalAttackAttempts++;
          if (event.result === "point") {
            attackPoints++;
          } else if (event.result === "error") {
            attackErrors++;
          }
        }
      });
    });
  
    return totalAttackAttempts > 0
      ? (attackPoints - attackErrors) / totalAttackAttempts
      : 0;
  };
  
  export const getTeamBlockEfficiency = (game, setNumber = null) => {
    let totalBlockAttempts = 0;
    let blockPoints = 0;
    let blockContinues = 0;
    let blockErrors = 0;
  
    const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets; 
  
    setsToProcess.forEach((set) => {
      set.events.forEach((event) => {
        if (event.action === "block") {
          totalBlockAttempts++;
          if (event.result === "point") {
            blockPoints++;
          } else if (event.result === "continue") {
            blockContinues++;
          } else if (event.result === "error") {
            blockErrors++;
          }
        }
      });
    });
  
    return totalBlockAttempts > 0
      ? (blockPoints + blockContinues - blockErrors) / totalBlockAttempts
      : 0;
  };
  
  
  // ---------------------
  // Individual Player Stats Calculations 
  // ---------------------
  
  // Generic stat calculation function (updated to take the game object)
  export const calculateStatsForAction = (game, playerId, action, setNumber = null) => {
    let totalAttempts = 0;
    let points = 0;
    let errors = 0;
    let validAttempts = 0;
  
    const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets; 
  
    setsToProcess.forEach((set) => {
      set.events.forEach((event) => {
        if (event.player === playerId && event.action === action) {
          totalAttempts++;
          if (event.result === "point") {
            points++;
          } else if (event.result === "error") {
            errors++;
          }
          // For dig and receive, a "continue" is a valid attempt
          if (['receive', 'dig'].includes(action) && event.result === "continue") { 
            validAttempts++;
          }
        }
      });
    });
  
    let efficiency = totalAttempts > 0 ? (points - errors) / totalAttempts : 0;
    if (['receive', 'dig'].includes(action)) {
      efficiency = totalAttempts > 0 ? validAttempts / totalAttempts : 0;
    }
  
    return { totalAttempts, points, errors, efficiency, validAttempts };
  };
  
  export const getServeStats = (game, playerId, setNumber = null) => {
    return calculateStatsForAction(game, playerId, "serve", setNumber);
  };
  
  export const getReceptionStats = (game, playerId, setNumber = null) => {
    return calculateStatsForAction(game, playerId, "receive", setNumber);
  };
  
  export const getSettingStats = (game, playerId, setNumber = null) => {
    return calculateStatsForAction(game, playerId, "set", setNumber);
  };
  
  export const getAttackStats = (game, playerId, setNumber = null) => {
    return calculateStatsForAction(game, playerId, "spike", setNumber);
  };
  
  export const getBlockStats = (game, playerId, setNumber = null) => {
    return calculateStatsForAction(game, playerId, "block", setNumber);
  };
  
  export const getDigStats = (game, playerId, setNumber = null) => {
    return calculateStatsForAction(game, playerId, "dig", setNumber);
  };
  
  // ---------------------
  // Advanced Individual Player Stats Calculations
  // ---------------------
  
  export const getAdvancedServeStats = (game, playerId, setNumber = null) => {
    let totalAttempts = 0;
    let points = 0;
    let errors = 0;
    let perfectServes = 0;
    let goodServes = 0;
    let typePerPoint = {};
    let targetPerPoint = {};
  
    const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets; 
  
    setsToProcess.forEach((set) => {
      set.events.forEach((event) => {
        if (event.player === playerId && event.action === "serve") {
          totalAttempts++;
          if (event.result === "point") {
            points++;
  
            // Count points per type 
            if (event.type) {
              typePerPoint[event.type] = (typePerPoint[event.type] || 0) + 1;
            }
  
            // Count points and attempts per target
            if (event.target) {
              if (!targetPerPoint[event.target]) {
                targetPerPoint[event.target] = { points: 0, attempts: 0 };
              }
              targetPerPoint[event.target].points++;
            }
          } 
          if (event.result === "error") errors++;
  
          if (event.evaluation === "Perfect") perfectServes++;
          if (event.evaluation === "Good") goodServes++;
  
          // Count attempts per target
          if (event.target) {
            if (!targetPerPoint[event.target]) {
              targetPerPoint[event.target] = { points: 0, attempts: 0 };
            }
            targetPerPoint[event.target].attempts++;
          } 
        }
      });
    });
    
    const aceServePercentage = totalAttempts > 0 ? ((points - errors) / totalAttempts) * 100 : 0;
    const validServePercentage = totalAttempts > 0 ? ((perfectServes + goodServes - errors) / totalAttempts) * 100 : 0;
  
    // Calculate percentages for targetPerPoint
    for (const target in targetPerPoint) {
      targetPerPoint[target].percentage = targetPerPoint[target].attempts > 0
        ? targetPerPoint[target].points / targetPerPoint[target].attempts
        : 0;
    }
  
    return {
      totalAttempts,
      points,
      errors,
      aceServePercentage,
      validServePercentage,
      typePerPoint,
      targetPerPoint
    };
  };
  
  export const getAdvancedReceptionStats = (game, playerId, setNumber = null) => {
    let totalAttempts = 0;
    let perfectReceptions = 0;
    let goodReceptions = 0;
    let errors = 0;
  
    const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets; 
  
    setsToProcess.forEach((set) => {
      set.events.forEach((event) => {
        if (event.player === playerId && event.action === "receive") {
          totalAttempts++;
          if (event.evaluation === "Perfect") perfectReceptions++;
          if (event.evaluation === "Good") goodReceptions++;
          if (event.result === "error") errors++;
        }
      });
    });
  
    const validReceptionPercentage = totalAttempts > 0
      ? ((perfectReceptions + goodReceptions - errors) / totalAttempts) * 100 // Convert to percentage
      : 0;
  
    return {
      totalAttempts,
      validReceptionPercentage
    };
  };
  
  export const getAdvancedSettingStats = (game, playerId, setNumber = null) => {
    let totalAttempts = 0;
    let perfectSets = 0;
    let goodSets = 0;
    let setTargetDistribution = {};
  
    const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets;
  
    setsToProcess.forEach((set) => {
      set.events.forEach((event) => {
        if (event.player === playerId && event.action === "set") {
          totalAttempts++;
          if (event.evaluation === "Perfect") perfectSets++;
          if (event.evaluation === "Good") goodSets++;
  
          if (event.target) {
            setTargetDistribution[event.target] = (setTargetDistribution[event.target] || 0) + 1;
          }
        }
      });
    });
  
    const successfulSetPercentage = totalAttempts > 0
      ? (perfectSets + goodSets) / totalAttempts * 100  // Convert to percentage
      : 0;
  
    return {
      totalAttempts,
      successfulSetPercentage,
      setTargetDistribution
    };
  };
  
  export const getAdvancedAttackStats = (game, playerId, setNumber = null) => {
    let totalAttempts = 0;
    let points = 0;
    let errors = 0;
    let perfectAttacks = 0;
    let goodAttacks = 0;
    let typePerPoint = {};
    let targetPerPoint = {};
  
    const setsToProcess = setNumber !== null ? [game.sets[setNumber - 1]] : game.sets; 
  
    setsToProcess.forEach((set) => {
      set.events.forEach((event) => {
        if (event.player === playerId && event.action === "spike") {
          totalAttempts++;
          if (event.result === "point") {
            points++;
  
            if (event.type) {
              typePerPoint[event.type] = (typePerPoint[event.type] || 0) + 1;
            }
  
            if (event.target) {
              if (!targetPerPoint[event.target]) {
                targetPerPoint[event.target] = { points: 0, attempts: 0 };
              }
              targetPerPoint[event.target].points++;
            }
          } 
          if (event.result === "error") errors++;
  
          if (event.evaluation === "Perfect") perfectAttacks++;
          if (event.evaluation === "Good") goodAttacks++;
  
          if (event.target) {
            if (!targetPerPoint[event.target]) {
              targetPerPoint[event.target] = { points: 0, attempts: 0 };
            }
            targetPerPoint[event.target].attempts++;
          }
        }
      });
    });
  
    const killPercentage = totalAttempts > 0 ? (points - errors) / totalAttempts * 100 : 0; // Convert to percentage
    const validAttackPercentage = totalAttempts > 0 
      ? (points + perfectAttacks + goodAttacks - errors) / totalAttempts * 100  // Convert to percentage
      : 0;
  
    for (const target in targetPerPoint) {
      targetPerPoint[target].percentage = targetPerPoint[target].attempts > 0
        ? targetPerPoint[target].points / targetPerPoint[target].attempts
        : 0;
    }
  
    return {
      totalAttempts,
      points,
      errors,
      killPercentage,
      validAttackPercentage,
      typePerPoint,
      targetPerPoint
    };
  };