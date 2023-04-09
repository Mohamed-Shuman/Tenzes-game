import React from "react";
export default function Die(props){
    let dieFace = "";
    switch (props.value) {
      case 1:
        dieFace = "../public/images/dieFace1.png";
        break;
      case 2:
        dieFace = "../public/images/dieFace2.png";
        break;
      case 3:
        dieFace = "../public/images/dieFace3.png";
        break;
      case 4:
        dieFace = "../public/images/dieFace4.png";
        break;
      case 5:
        dieFace = "../public/images/dieFace5.png";
        break;
      case 6:
        dieFace = "../public/images/dieFace6.png";
        break;
      default:
        break;
    }

    const styles = {
        backgroundColor: props.isHeld? "#59E391" : "white",
        backgroundImage: `url(${dieFace})`,
        backgroundSize: "cover",
    }
    return(
        <div className="die" style={styles} onClick={props.holdDice}>
            
        </div>
    )
}