const buttons = document.querySelectorAll(".btn");
const elevators = document.querySelectorAll(".svgwraper");

let queueFloors = [];

let allLiftStatus = [
  {
    liftIndex: 0,
    moving: false,
    floor: 0,
  },
  {
    liftIndex: 1,
    moving: false,
    floor: 0,
  },
  {
    liftIndex: 2,
    moving: false,
    floor: 0,
  },
  {
    liftIndex: 3,
    moving: false,
    floor: 0,
  },
  {
    liftIndex: 4,
    moving: false,
    floor: 0,
  },
];

function findMinDistance(currentFloor, allLiftStatus) {
  let minDistance = Infinity;
  let minDistanceIndex = Infinity;

  for (let i = 0; i < allLiftStatus.length; i++) {
    let diff = Math.abs(currentFloor - allLiftStatus[i].floor);

    if (diff < minDistance && !allLiftStatus[i].moving) {
      minDistance = diff;
      minDistanceIndex = i;
    }
  }

  return [minDistance, minDistanceIndex];
}

function isLiftAlreayThere(allLiftStatus, calledFloor) {
  return allLiftStatus.some((lift) => lift.floor === calledFloor);
}

function allLiftsMoving(allLiftStatus) {
  return allLiftStatus.every((lift) => lift.moving === true);
}

const playSound = () => {
  const audio = new Audio("./lift bell.mp3");
  audio.play();
};

buttons.forEach((button) => {
  
  button.addEventListener("click", () => {
    const clickedFloor = parseInt(button.id.split("-")[1]);      

    if (allLiftsMoving(allLiftStatus)) {
      queueFloors.push(clickedFloor);
    }

    if (!isLiftAlreayThere(allLiftStatus, clickedFloor)) {

      button.style.backgroundColor = "red";
      button.textContent = "Waiting";
      button.disabled = true; 

      LiftStatus(clickedFloor, button);
    }
  });
});

function LiftStatus(clickedFloor, button) {  
  let pos;

  const nearestLiftDistance = findMinDistance(clickedFloor, allLiftStatus)[0];
  const nearestLiftIndex = findMinDistance(clickedFloor, allLiftStatus)[1];


  if(clickedFloor !== 0 ){
    const rowElement = document.getElementById(`row-${clickedFloor}`);
    const destinationBox = rowElement.querySelector(
      `.box:nth-child(${nearestLiftIndex + 2})`
    );
    if (destinationBox) {
      destinationBox.textContent = `${nearestLiftDistance * 0.5} Sec`;
    }
  }

  pos = nearestLiftIndex;
  MoveLift(clickedFloor, pos, button);
}

function MoveLift(clickedFloor, pos, button) {
  const elevator = elevators[pos];
  const currentFloor =  allLiftStatus[pos].floor

  allLiftStatus[pos].floor = clickedFloor;
  allLiftStatus[pos].moving = true;

  elevator.querySelectorAll("path").forEach((path) => {
    path.setAttribute("fill", "red");
  });

  let duration = Math.abs(clickedFloor - currentFloor) * 0.5;

    elevator.style.transition = `transform ${duration}s linear`;
    elevator.style.transform = `translateY(-${clickedFloor * 130}%)`;

  setTimeout(() => {

    if(clickedFloor !== 0 ){
      const rowElement = document.getElementById(`row-${clickedFloor}`);
      const destinationBox = rowElement.querySelector(
        `.box:nth-child(${pos + 2})`
      );
      if (destinationBox) {
        destinationBox.textContent = ``;
      }
    } 
    
    playSound();
    elevator.querySelectorAll("path").forEach((path) => {
      path.setAttribute("fill", "green");
    });

    button.style.backgroundColor = "white";
    button.textContent = "Arrived";
    button.style.border="1px solid green"
 
  }, duration * 1000);

  setTimeout(() => {

    allLiftStatus[pos].moving = false;

    button.style.backgroundColor = "rgb(101, 237, 101)";
    button.textContent = "Call";
    button.style.border="none"

    elevator.querySelectorAll("path").forEach((path) => {
      path.setAttribute("fill", "black");
    });

    if (queueFloors.length) {

      const clickedFloor = queueFloors.shift()
      const button = document.getElementById(`btn-${clickedFloor}`)  
      LiftStatus(clickedFloor, button);
    }
  }, duration * 1000 + 2000);
}

