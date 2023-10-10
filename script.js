const modalContainer = document.querySelector(".modal-cont");
const addBtn = document.querySelector(".add-btn");
const colorModalArr = document.querySelectorAll(".color_modal");
const textArea = document.querySelector(".textarea-cont");
const priorityColorArr = document.querySelectorAll(".toolbox_priority_cont .color");
let deleteBtn = document.querySelector(".remove-btn");
const mainContiner = document.querySelector(".main-cont");

const uid = new ShortUniqueId({ length: 5 });
const colorArray = ["red","blue","green","purple"];
let deleteFlag = false;
let ticketArr = [];
if(localStorage.getItem("ticketArr") != null){
    let stringArr = localStorage.getItem("ticketArr");
    ticketArr = JSON.parse(stringArr);
    for(let i=0; i<ticketArr.length; i++){
        let ticketOb = ticketArr[i];
        createTicket(ticketOb.color,ticketOb.task,ticketOb.id,true);
    }
}

addBtn.addEventListener("click",function(){
    modalContainer.style.display = "flex";
    textArea.focus();
})

for(let i=0; i<colorModalArr.length; i++){
    let currColorElm = colorModalArr[i];
    currColorElm.addEventListener("click",function(e){
        for(let i=0; i<colorModalArr.length; i++){
            colorModalArr[i].classList.remove("selected");
        }
        const targetColorElm = e.target;
        targetColorElm.classList.add("selected");
    })
}

textArea.addEventListener("keydown",function(e){
    if(e.key == "Enter" && e.shiftKey == false){
        modalContainer.style.display = "none";

        const task = textArea.value;
        const currColorElm = modalContainer.querySelector(".selected");
        const taskColor = currColorElm.getAttribute("currColor");
        textArea.value="";
        createTicket(taskColor,task);
    }
})

deleteBtn.addEventListener("click",function(){
    if(deleteFlag == false){
        deleteBtn.style.color = "red";
        deleteFlag = true;
    }else{
        deleteBtn.style.color = "black";
        deleteFlag = false; 
    }
})

function createTicket(taskColor,task,pid,flag){
    let id;
    if(flag == true){
        id = pid;
    }else{
        id = uid.rnd();
    }
    const ticketCont = document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML = `
    <div class="ticket-color ${taskColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="ticket-area">${task}</div>
    <i class="fa-solid fa-lock lock_icon"></i>
    `;

    mainContiner.append(ticketCont);

    if(flag === undefined){
        let ticketObj = {
            id:id,
            task:task,
            color: taskColor
        }
        ticketArr.push(ticketObj);
        setLocalStorage();
    }

    const lockBtn = ticketCont.querySelector(".lock_icon");
    const ticketArea = ticketCont.querySelector(".ticket-area");
    handleLockButton(lockBtn,ticketArea,id);

    const ticketColorElm = ticketCont.querySelector(".ticket-color");
    handleChangeColor(ticketColorElm,id);

    handleDelete(ticketCont,id);
}

function handleLockButton(lockBtn,ticketArea,id){
    lockBtn.addEventListener("click",function(){
        const isLocked = lockBtn.classList.contains("fa-lock");
        if(isLocked == true){
            lockBtn.classList.replace("fa-lock","fa-lock-open");
            ticketArea.setAttribute("contenteditable","true");
        }else{
            lockBtn.classList.remove("fa-lock-open");
            lockBtn.classList.add("fa-lock");
            ticketArea.setAttribute("contenteditable","false");
        }

        for(let i=0; i<ticketArr.length; i++){
            if(ticketArr[i].id == id){
                let newTask = ticketArea.innerText;
                ticketArr[i].task = newTask;
                console.log(newTask);
                break;
            }
        }
        setLocalStorage();
    })
}

function handleChangeColor(ticketColorElm,id){
    ticketColorElm.addEventListener("click",function(){
        let currColor = ticketColorElm.classList[1];
        let cidx = colorArray.indexOf(currColor);
        let nidx = (cidx+1)%colorModalArr.length;
        let nextColor = colorArray[nidx];
        ticketColorElm.classList.remove(currColor);
        ticketColorElm.classList.add(nextColor);

        for(let i=0; i<ticketArr.length; i++){
            console.log("hi");
            if(ticketArr[i].id == id){
                ticketArr[i].color = nextColor;
                break;
            }
        }
        setLocalStorage();
    })
}

for(let i=0; i<priorityColorArr.length; i++){
    let currColorElm = priorityColorArr[i];
    currColorElm.addEventListener("click",function(e){
        for(let i=0; i<priorityColorArr.length; i++){
            priorityColorArr[i].classList.remove("selected");
        }
        const targetColorElm = e.target;
        targetColorElm.classList.add("selected");
        let currentColor = colorArray[i];
        filterTickets(currentColor);
    })
}

for(let i=0; i<priorityColorArr.length; i++){
    let currColorElm = priorityColorArr[i];
    currColorElm.addEventListener("dblclick",function(){
        for(let i=0; i<priorityColorArr.length; i++){
            priorityColorArr[i].classList.remove("selected");
        }
        showAllTickets();
    })
}

function filterTickets(currentColor){
    const ticketsArr = mainContiner.querySelectorAll(".ticket-cont")
    for(let i=0; i<ticketsArr.length; i++){
        let cTicket = ticketsArr[i];
        const isPresent = cTicket.querySelector(`.${currentColor}`);
        if(isPresent == null){
            cTicket.style.display = "none";
        }else{
            cTicket.style.display = "block";
        }
    }
}

function showAllTickets(){
    const ticketsArr = mainContiner.querySelectorAll(".ticket-cont")
    for(let i=0; i<ticketsArr.length; i++){
        let cTicket = ticketsArr[i];
        cTicket.style.display = "block";
    }
}

function handleDelete(ticketCont,id){
    ticketCont.addEventListener("click",function(){
        if(deleteFlag == true){
            let res = confirm("Do you want to delete this?");
            if(res){
                ticketCont.remove();
                let ridx = -1;
                for(let i=0; i<ticketArr.length; i++){
                    if(ticketArr[i].id == id){
                        ridx = i;
                        break;
                    }
                }
                ticketArr.splice(ridx,1);
                setLocalStorage();
            }
        }
    })
}

function setLocalStorage(){
    const strTicketArr = JSON.stringify(ticketArr);
    localStorage.setItem("ticketArr",strTicketArr);
}