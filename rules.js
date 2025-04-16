class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); //DONE TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
        console.log(this.engine.storyData);
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // DONE TODO: replace this text by the initial location of the story
        //console.log("#1",this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // DONE TODO: use `key` to get the data object for the current story location
        
        this.engine.show(locationData.Body); // DONE TODO: replace this text by the Body of the location data
        // console.log("#2 Lets see:",this.engine.storyData.Locations[key]);

        if(this.engine.storyData.Locations[key].Choices) { // Done TODO: check if the location has any Choices
            //console.log("#3 check");
            for(let choice of this.engine.storyData.Locations[key].Choices) { // Done TODO: loop over the location's Choices
                //console.log("check #4");
                this.engine.addChoice(choice.Text, choice); // Done TODO: use the Text of the choice
                // Done TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
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

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');