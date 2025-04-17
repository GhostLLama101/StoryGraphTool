class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");

        // Initialize valve states
        this.engine.nevadaValve = false;
        this.engine.arizonaValve = false;
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

        // For Dam location, check if both valves are turned before allowing "the end" option
        if(key === "Dam") {
            for(let choice of locationData.Choices) {
                if(choice.Text === "the end") {
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
            this.engine.addChoice("The end.");
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

class ValveRoom extends Location {
    create(key) {
        this.locationKey = key;
        let locationData = this.engine.storyData.Locations[key];

        if (!locationData) {
            console.error("Location data not found for key:", key);
            return;
        }

        //this.engine.show(locationData.Body);

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
                this.engine.show("Both valves are now turned. You can now finish the journey at the Dam.");
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