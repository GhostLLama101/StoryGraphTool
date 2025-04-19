class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");

        // Initialize valve states
        this.engine.nevadaValve = false;
        this.engine.arizonaValve = false;
        this.engine.nevadaRadio = false;
        this.engine.arizonaRadio = false;
        console.log(this.engine.storyData);
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); 
    }
}

class Location extends Scene {
    create(key) {
        this.locationKey = key;
        let locationData = this.engine.storyData.Locations[key]; 
        
        this.engine.show(locationData.Body); 

       
        if(locationData.crank) {
            // This is a valve location, use pipes class instead
            this.engine.gotoScene(ValveRoom, key);
            return;
        }

        if(locationData.radio) {
            // This is a radio location
            this.engine.gotoScene(Radio, key);
            return;
        }

        // For Dam location, check if both valves are turned before allowing "the end" option
        if(key === "Dam") {
            for(let choice of locationData.Choices) {
                if(choice.Text === "Leave") {
                    // Only show "the end" option if both valves are turned
                    if(this.engine.nevadaValve && this.engine.arizonaValve) {
                        this.engine.addChoice(choice.Text, choice);
                    }
                } else {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        } else if(locationData.Choices) {
            for(let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("Leave Dam");
        }

    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}
// this i for the radio in the lounges
// class Radio extends Location {
//     create(key) {
//         this.locationKey = key;
//         let locationData = this.engine.storyData.Locations[key];

//         if (!locationData) {
//             console.error("Location data not found for key:", key);
//             return;
//         }

//          // Only show "Turn valve" if it hasn't been turned yet
//         if ((this.locationKey === "Nevada_Lounge" && !this.engine.nevadaValve) ||
//             (this.locationKey === "Arizona_Lounge" && !this.engine.arizonaValve)) {
//             this.engine.addChoice("Turn on Radio", { isValve: true });
//         }

//         // Add back options
//         if (locationData.Choices) {
//             for (let choice of locationData.Choices) {
//                 this.engine.addChoice(choice.Text, choice);
//             }
//         }
//     }

//     handleChoice(choice) {
//         if (!choice) {
//             console.error("Received undefined choice");
//             return;
//         }

//         if (choice.isValve) {
//             // Handle valve turning
//             if (this.locationKey === "Nevada_Lounge") {
//                 this.engine.nevadaRadio = true;
//                 this.engine.show("You are listening to Dam FM hopefull this makes you work harder");
//             } else if (this.locationKey === "Arizona_Lounge") {
//                 this.engine.arizonaRadio = true;
//                 this.engine.show("You are listing to Dam FM now playing your bosses favorite 'get back to work!'");
//             }

//             // Instead of clearing choices, just recreate the scene
//             this.create(this.locationKey);

//             if (this.engine.nevadaRadio && this.engine.arizonaRadio) {
//                 this.engine.show("............. Stop listing to the radio and get back to work");
//             }
//         }
//         else if (choice.Text) {
//             this.engine.show("> " + choice.Text);
//             this.engine.gotoScene(Location, choice.Target);
//         }
//         else {
//             console.error("Invalid choice:", choice);
//             this.engine.gotoScene(Location, "Dam");
//         }
//     }
// }
class Radio extends Location {
    create(key) {
        this.locationKey = key;
        let locationData = this.engine.storyData.Locations[key];

        // Show current radio state
        if (key === "Nevada_Lounge") {
            this.engine.show(this.engine.nevadaRadio ? 
                "The radio is currently ON" : 
                "The radio is currently OFF");
        } else if (key === "Arizona_Lounge") {
            this.engine.show(this.engine.arizonaRadio ? 
                "The radio is currently ON" : 
                "The radio is currently OFF");
        }
        
        if (this.engine.nevadaRadio && this.engine.arizonaRadio) {
            this.engine.show("............. Stop listing to the radio and get back to work");
        }

        // Toggle option
        const radioText = (key === "Nevada_Lounge" && this.engine.nevadaRadio) || 
                         (key === "Arizona_Lounge" && this.engine.arizonaRadio) ?
                         "Turn off Radio" : "Turn on Radio";
        
        this.engine.addChoice(radioText, { isRadio: true });

        // Add other choices
        if (locationData.Choices) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        }
    }

    handleChoice(choice) {
        if (!choice) return;

        if (choice.isRadio) {
            // Toggle radio state
            if (this.locationKey === "Nevada_Lounge") {
                this.engine.nevadaRadio = !this.engine.nevadaRadio;
                this.engine.show(this.engine.nevadaRadio ? 
                    "You turned on the radio. Dam FM is playing." : 
                    "You turned off the radio. Silence returns.");
            } else if (this.locationKey === "Arizona_Lounge") {
                this.engine.arizonaRadio = !this.engine.arizonaRadio;
                this.engine.show(this.engine.arizonaRadio ? 
                    "You turned on the radio. Your boss's voice crackles through." : 
                    "You turned off the radio. Peace at last.");
            }
            
            // Refresh the scene to show updated state
            this.create(this.locationKey);
        } 
        else if (choice.Text) {
            this.engine.show("> " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        }
    }
}

class ValveRoom extends Location {
    create(key) {
        this.locationKey = key;
        let locationData = this.engine.storyData.Locations[key];

        if (!locationData) {
            console.error("Location data not found for key:", key);
            return;
        }


        // Only show "Turn valve" if it hasn't been turned yet
        if ((this.locationKey === "Valve_house" && !this.engine.nevadaValve) ||
            (this.locationKey === "A_Valve_house" && !this.engine.arizonaValve)) {
            this.engine.addChoice("Turn valve", { isValve: true });
        }

        // Add back options
        if (locationData.Choices) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        }
    }

    handleChoice(choice) {
        if (!choice) {
            console.error("Received undefined choice");
            return;
        }

        if (choice.isValve) {
            // Handle valve turning
            if (this.locationKey === "Valve_house") {
                this.engine.nevadaValve = true;
                this.engine.show("You turned the Nevada valve. You hear water rushing through pipes.");
            } else if (this.locationKey === "A_Valve_house") {
                this.engine.arizonaValve = true;
                this.engine.show("You turned the Arizona valve. You hear water rushing through pipes.");
            }

            // Instead of clearing choices, just recreate the scene
            this.create(this.locationKey);

            if (this.engine.nevadaValve && this.engine.arizonaValve) {
                this.engine.show("Both valves are now turned. You did your job and you should leave. Go back to the Dam and get out.");
            }
        }
        else if (choice.Text) {
            this.engine.show("> " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        }
        else {
            console.error("Invalid choice:", choice);
            this.engine.gotoScene(Location, "Dam");
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}



Engine.load(Start, 'myStory.json');