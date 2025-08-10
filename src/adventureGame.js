// ===========================================
// The Dragon's Quest - Text Adventure Game
// Complete version with expanded items, combat, locations, and victory
// ===========================================

// Include readline for player input
const readline = require("readline-sync");

// Game state variables
let gameRunning = true;
let playerName = "";
let playerHealth = 100;
let playerGold = 20; // Starting gold
let currentLocation = "village";

// Item templates
const healthPotion = {
  name: "Health Potion",
  type: "potion",
  value: 5,
  effect: 30,
  description: "Restores 30 health points",
};

const sword = {
  name: "Sword",
  type: "weapon",
  value: 10,
  effect: 10,
  description: "A sturdy blade for combat",
};

const steelSword = {
  name: "Steel Sword",
  type: "weapon",
  value: 25,
  effect: 20,
  description: "A sharp steel sword, more powerful than basic swords",
};

const woodenShield = {
  name: "Wooden Shield",
  type: "armor",
  value: 8,
  effect: 5,
  description: "Reduces damage taken in combat",
};

const ironShield = {
  name: "Iron Shield",
  type: "armor",
  value: 20,
  effect: 10,
  description: "A sturdy iron shield, better protection than wooden shield",
};

// Player inventory (stores item objects)
let inventory = [];

// ===========================
// Display Functions
// ===========================

function showStatus() {
  console.log("\n=== " + playerName + "'s Status ===");
  console.log("❤️  Health: " + playerHealth);
  console.log("💰 Gold: " + playerGold);
  console.log("📍 Location: " + currentLocation);
  console.log("🎒 Inventory:");
  if (inventory.length === 0) {
    console.log("   Nothing in inventory");
  } else {
    inventory.forEach((item, index) => {
      console.log(
        "   " + (index + 1) + ". " + item.name + " - " + item.description
      );
    });
  }
}

function showHelp() {
  console.log("\n=== AVAILABLE COMMANDS ===");
  console.log("Navigate locations and buy equipment to prepare for battles.");
  console.log("Use items like potions to heal.");
  console.log("Defeat monsters and ultimately the dragon to win!");
  console.log("Use numbered choices to make selections.");
  console.log("Good luck on your quest, brave adventurer!");
}

function showVictory() {
  console.log("\n=== VICTORY! ===");
  console.log("You have slain the dragon and saved the kingdom!");
  console.log(`Final stats for ${playerName}:`);
  console.log(`Health: ${playerHealth}`);
  console.log(`Gold: ${playerGold}`);
  console.log("Thank you for playing The Dragon's Quest!");
}

// Show current location and options with numbers
function showLocation() {
  console.log("\n=== " + currentLocation.toUpperCase() + " ===");

  if (currentLocation === "village") {
    console.log(
      "You're in a bustling village. The blacksmith and market are nearby."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Go to blacksmith");
    console.log("2: Go to market");
    console.log("3: Enter forest");
    console.log("4: Attempt dragon's lair (Requires steel sword + armor)");
    console.log("5: Check status");
    console.log("6: Use item");
    console.log("7: Help");
    console.log("8: Quit game");
  } else if (currentLocation === "blacksmith") {
    console.log(
      "The heat from the forge fills the air. Weapons and armor line the walls."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Buy sword (" + sword.value + " gold)");
    console.log("2: Buy steel sword (" + steelSword.value + " gold)");
    console.log("3: Buy wooden shield (" + woodenShield.value + " gold)");
    console.log("4: Buy iron shield (" + ironShield.value + " gold)");
    console.log("5: Return to village");
    console.log("6: Check status");
    console.log("7: Use item");
    console.log("8: Help");
    console.log("9: Quit game");
  } else if (currentLocation === "market") {
    console.log(
      "Merchants sell their wares from colorful stalls. A potion seller catches your eye."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Buy health potion (" + healthPotion.value + " gold)");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  } else if (currentLocation === "forest") {
    console.log(
      "The forest is dark and foreboding. You hear strange noises all around you."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Fight a monster");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  } else if (currentLocation === "dragonsLair") {
    console.log(
      "You stand in the dragon's lair, the air thick with smoke and danger."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Fight the dragon");
    console.log("2: Flee to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  }
}

// ===========================
// Item helper functions
// ===========================

function getItemsByType(type) {
  return inventory.filter((item) => item.type === type);
}

function getBestItem(type) {
  const items = getItemsByType(type);
  if (items.length === 0) return null;
  return items.reduce((best, item) => (item.effect > best.effect ? item : best));
}

function hasGoodEquipment() {
  const hasSteelSword = inventory.some(
    (item) => item.type === "weapon" && item.name === "Steel Sword"
  );
  const hasArmor = inventory.some((item) => item.type === "armor");
  return hasSteelSword && hasArmor;
}

// ===========================
// Combat Functions
// ===========================

function updateHealth(amount) {
  playerHealth += amount;
  if (playerHealth > 100) {
    playerHealth = 100;
    console.log("You're at full health!");
  }
  if (playerHealth <= 0) {
    playerHealth = 0;
    console.log("You're gravely wounded!");
  }
  console.log("Health is now: " + playerHealth);
  return playerHealth;
}

/**
 * Handles combat with monster or dragon
 * @param {boolean} isDragon
 * @returns {boolean} true if player wins, false otherwise
 */
function handleCombat(isDragon = false) {
  const weapon = getBestItem("weapon");
  const armor = getBestItem("armor");

  if (!weapon) {
    console.log("Without a weapon, you must retreat!");
    updateHealth(-20);
    return false;
  }

  if (isDragon && !hasGoodEquipment()) {
    console.log(
      "You are not equipped well enough to face the dragon! Get a steel sword and armor first."
    );
    return false;
  }

  const monster = {
    name: isDragon ? "Dragon" : "Monster",
    health: isDragon ? 50 : 20,
    damage: isDragon ? 20 : 10,
  };

  console.log(`You enter combat against the ${monster.name}!`);
  console.log(`You wield your ${weapon.name} (Damage: ${weapon.effect})`);
  if (armor) {
    console.log(`You wear your ${armor.name} (Protection: ${armor.effect})`);
  } else {
    console.log("You have no armor for protection.");
  }

  while (playerHealth > 0 && monster.health > 0) {
    monster.health -= weapon.effect;
    if (monster.health < 0) monster.health = 0;
    console.log(
      `You strike the ${monster.name} for ${weapon.effect} damage. ${monster.name} health: ${monster.health}`
    );

    if (monster.health === 0) break;

    let damageTaken = monster.damage;
    if (armor) damageTaken -= armor.effect;
    if (damageTaken < 1) damageTaken = 1;

    console.log(
      `${monster.name} attacks you for ${monster.damage} damage, reduced by your armor to ${damageTaken} damage.`
    );
    updateHealth(-damageTaken);
  }

  if (playerHealth > 0) {
    console.log(`Victory! You defeated the ${monster.name}! You found 10 gold!`);
    playerGold += 10;
    return true;
  } else {
    console.log(`You were defeated by the ${monster.name}...`);
    return false;
  }
}

// ===========================
// Item usage
// ===========================

function useItem() {
  if (inventory.length === 0) {
    console.log("\nYou have no items!");
    return false;
  }

  console.log("\n=== Inventory ===");
  inventory.forEach((item, index) => {
    console.log(index + 1 + ". " + item.name);
  });

  let choice = readline.question("Use which item? (number or 'cancel'): ");
  if (choice.toLowerCase() === "cancel") return false;

  let index = parseInt(choice) - 1;
  if (index >= 0 && index < inventory.length) {
    let item = inventory[index];

    if (item.type === "potion") {
      console.log("\nYou drink the " + item.name + ".");
      updateHealth(item.effect);
      inventory.splice(index, 1);
      console.log("Health restored to: " + playerHealth);
      return true;
    } else if (item.type === "weapon" || item.type === "armor") {
      console.log(`\nYou ready your ${item.name} for battle.`);
      return true;
    }
  } else {
    console.log("\nInvalid item number!");
  }
  return false;
}

// ===========================
// Shopping
// ===========================

function buyFromBlacksmith(item) {
  if (playerGold >= item.value) {
    console.log(`\nBlacksmith: 'A fine ${item.name} for a brave adventurer!'`);
    playerGold -= item.value;
    inventory.push({ ...item });
    console.log(`You bought a ${item.name} for ${item.value} gold!`);
    console.log("Gold remaining: " + playerGold);
  } else {
    console.log("\nBlacksmith: 'Come back when you have more gold!'");
  }
}

function buyFromMarket(item) {
  if (playerGold >= item.value) {
    console.log(`\nMerchant: 'This ${item.name} will heal your wounds!'`);
    playerGold -= item.value;
    inventory.push({ ...item });
    console.log(`You bought a ${item.name} for ${item.value} gold!`);
    console.log("Gold remaining: " + playerGold);
  } else {
    console.log("\nMerchant: 'No gold, no potion!'");
  }
}

// ===========================
// Movement
// ===========================

function move(choiceNum) {
  let validMove = false;

  if (currentLocation === "village") {
    if (choiceNum === 1) {
      currentLocation = "blacksmith";
      console.log("\nYou enter the blacksmith's shop.");
      validMove = true;
    } else if (choiceNum === 2) {
      currentLocation = "market";
      console.log("\nYou enter the market.");
      validMove = true;
    } else if (choiceNum === 3) {
      currentLocation = "forest";
      console.log("\nYou venture into the forest...");
      validMove = true;
    } else if (choiceNum === 4) {
      if (hasGoodEquipment()) {
        currentLocation = "dragonsLair";
        console.log("\nYou bravely enter the dragon's lair...");
        validMove = true;
      } else {
        console.log(
          "You are not well-equipped enough to face the dragon yet! Get a steel sword and armor first."
        );
        validMove = false;
      }
    }
  } else if (currentLocation === "blacksmith" && choiceNum === 5) {
    currentLocation = "village";
    console.log("\nYou return to the village center.");
    validMove = true;
  } else if (currentLocation === "market" && choiceNum === 2) {
    currentLocation = "village";
    console.log("\nYou return to the village center.");
    validMove = true;
  } else if (currentLocation === "forest" && choiceNum === 2) {
    currentLocation = "village";
    console.log("\nYou hurry back to the safety of the village.");
    validMove = true;
  } else if (currentLocation === "dragonsLair" && choiceNum === 2) {
    currentLocation = "village";
    console.log("\nYou flee back to the village.");
    validMove = true;
  }

  return validMove;
}

// ===========================
// Input Validation
// ===========================

function isValidChoice(input, max) {
  if (input === "") return false;
  let num = parseInt(input);
  return num >= 1 && num <= max;
}

// ===========================
// Main Game Loop
// ===========================

function main() {
  console.log("=================================");
  console.log("       The Dragon's Quest        ");
  console.log("=================================");
  console.log("\nYour quest: Defeat the dragon in the mountains!");

  playerName = readline.question("\nWhat is your name, brave adventurer? ");
  console.log("\nWelcome, " + playerName + "!");
  console.log("You start with " + playerGold + " gold.");

  while (gameRunning) {
    showLocation();

    let validChoice = false;
    while (!validChoice) {
      try {
        let input = readline.question("\nEnter choice (number): ");
        if (input.trim() === "") throw "Please enter a number!";

        let choiceNum = parseInt(input);
        if (isNaN(choiceNum)) throw "That's not a number!";

        // Max choice depends on location
        let maxChoice = 0;
        switch (currentLocation) {
          case "village":
            maxChoice = 8;
            break;
          case "blacksmith":
            maxChoice = 9;
            break;
          case "market":
            maxChoice = 6;
            break;
          case "forest":
            maxChoice = 6;
            break;
          case "dragonsLair":
            maxChoice = 6;
            break;
          default:
            maxChoice = 1;
        }

        if (choiceNum < 1 || choiceNum > maxChoice)
          throw `Please enter a number between 1 and ${maxChoice}.`;

        validChoice = true;

        if (currentLocation === "village") {
          if (choiceNum >= 1 && choiceNum <= 4) {
            if (choiceNum === 3) {
              // Enter forest
              move(choiceNum);
            } else if (choiceNum === 4) {
              // Dragon's lair
              move(choiceNum);
            } else {
              move(choiceNum);
            }
          } else if (choiceNum === 5) {
            showStatus();
          } else if (choiceNum === 6) {
            useItem();
          } else if (choiceNum === 7) {
            showHelp();
          } else if (choiceNum === 8) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "blacksmith") {
          if (choiceNum >= 1 && choiceNum <= 4) {
            // Buy items
            switch (choiceNum) {
              case 1:
                buyFromBlacksmith(sword);
                break;
              case 2:
                buyFromBlacksmith(steelSword);
                break;
              case 3:
                buyFromBlacksmith(woodenShield);
                break;
              case 4:
                buyFromBlacksmith(ironShield);
                break;
            }
          } else if (choiceNum === 5) {
            move(choiceNum);
          } else if (choiceNum === 6) {
            showStatus();
          } else if (choiceNum === 7) {
            useItem();
          } else if (choiceNum === 8) {
            showHelp();
          } else if (choiceNum === 9) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "market") {
          if (choiceNum === 1) {
            buyFromMarket(healthPotion);
          } else if (choiceNum === 2) {
            move(choiceNum);
          } else if (choiceNum === 3) {
            showStatus();
          } else if (choiceNum === 4) {
            useItem();
          } else if (choiceNum === 5) {
            showHelp();
          } else if (choiceNum === 6) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "forest") {
          if (choiceNum === 1) {
            if (!handleCombat(false)) {
              if (playerHealth > 0) currentLocation = "village";
            }
          } else if (choiceNum === 2) {
            move(choiceNum);
          } else if (choiceNum === 3) {
            showStatus();
          } else if (choiceNum === 4) {
            useItem();
          } else if (choiceNum === 5) {
            showHelp();
          } else if (choiceNum === 6) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "dragonsLair") {
          if (choiceNum === 1) {
            if (handleCombat(true)) {
              showVictory();
              gameRunning = false;
            } else {
              if (playerHealth > 0) {
                console.log("You barely escaped with your life!");
                currentLocation = "village";
              }
            }
          } else if (choiceNum === 2) {
            move(choiceNum);
          } else if (choiceNum === 3) {
            showStatus();
          } else if (choiceNum === 4) {
            useItem();
          } else if (choiceNum === 5) {
            showHelp();
          } else if (choiceNum === 6) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        }
      } catch (err) {
        console.log("\nError: " + err);
        console.log("Please try again!");
      }
    }
  }
}

main();
