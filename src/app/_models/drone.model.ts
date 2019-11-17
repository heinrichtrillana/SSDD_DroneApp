

export class Drone {

    id : string;

    position : Position;
    rotation : Rotation;

    battery : number;
    rotor : Rotor[];
    
    constructor(){}
}

class Position {
    x : number;
    y : number;

    constructor(){}

}

class Rotation {
    roll : number;
    pitch : number;
    yaw : number;

    constructor(){}

}

class Rotor{
    state : boolean;

    constructor(){}

}