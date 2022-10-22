const textInput = document.getElementById("text-input")
const costInput = document.getElementById("cost-input")
const dayInput = document.getElementById("day-input")
const dateInput = document.getElementById("date-input")
const targetInput = document.getElementById("target-input")
const occurenceInput = document.getElementById("occurence-input")
const totalContainerEl = document.getElementById("total-container")
const targetRemainingEl = document.getElementById("target-remaining")
const infoBtn = document.getElementById("info-btn")
const differenceBtn = document.getElementById("difference-btn")
const addBtn = document.getElementById("add-btn")
const shuffleBtn = document.getElementById("shuffle-btn")
const addTargetBtn = document.querySelector("#add-target-btn")
const saveTargetBtn = document.getElementById("save-target-btn")
const saveRepeatBtn = document.getElementById("save-repeat-btn")
const clearRepeatBtn= document.getElementById("clear-repeat-btn")
const closeTargetPopupBtn = document.getElementById("close-target-popup-btn")
const closeRepeatPopupBtn = document.getElementById("close-repeat-popup-btn")
const closeDifferencePopupBtn = document.getElementById("close-difference-popup-btn")
const resultEl =document.getElementById("saving-result")
const infoModal = document.getElementById("info-modal")
const targetModal = document.getElementById("target-modal")
const repeatModal = document.getElementById("repeat-modal")
const differenceModal = document.getElementById("difference-modal")
const savingUl = document.getElementById("saving-list")
const repeatForm = document.getElementById("repeat-form")
const tipsEl = document.getElementById("tips")

let savings = JSON.parse(localStorage.getItem('savings'))
let totalSavings = JSON.parse(localStorage.getItem('totalSavings'))
let savingTarget = JSON.parse(localStorage.getItem('savingTarget'))

const DateTime = luxon.DateTime;
const Interval = luxon.Interval;
const Duration = luxon.Duration;




loadFromLocalStorage()
displayTips() 

for (let [index, saving] of savings.entries()) {
    if(saving.days) {
        repeatIconLoad(index)
    }  
}

addBtn.addEventListener("click", (e) => {
    e.preventDefault()
    if (!textInput.value || !costInput.value) {
        alert("Please fill in both description and cost before pressing add.")
    } else {
        addSaving()
    }
})


function displayTips() {
//pick a random tip upon click
const tipsElLength = tipsEl.children.length
let tipCounter =0
shuffleBtn.addEventListener("click", () => {
    if(tipCounter >= tipsElLength) {
        tipCounter=0
    }
    for(i=0; i<tipsElLength; i++) {
        tipsEl.children[i].classList.add("hidden")
    }
    tipsEl.children[tipCounter].classList.remove("hidden")
    tipCounter++
})
}














function updateTarget(savingTarget) {
    const targetRemaining = (savingTarget - totalSavings)

    if (savingTarget) {
        if (targetRemaining > 0 ) {
            resultEl.innerHTML=`
            You saved £<span id="total-savings">${totalSavings.toFixed(2)}</span> so far. <br> £<span id="target-remaining">${targetRemaining.toFixed(2)}</span> to go.
            `
        } else if (targetRemaining < 0) {
            resultEl.innerHTML=`
            You exceeded your target by £<span id="target-remaining">${Math.abs(targetRemaining).toFixed(2)}</span>. <br> Well done!
            `
            showConfetti()
        }else if (targetRemaining === 0) {
        resultEl.innerHTML=`
        You reached your target of £<span id="target-remaining">${savingTarget.toFixed(2)}</span>. <br> Well done!
        `
        showConfetti()
        }   
    } else if (!savingTarget && totalSavings) {
        resultEl.innerHTML=`
        You saved £<span id="total-savings">${totalSavings.toFixed(2)}</span> so far. 
        `
    } else if (!savingTarget) {
        resultEl.innerHTML=`
       Start adding in how you're cutting down costs and saving money. Click the info button for help.
        `
    }
    

}

function addTarget() {

    if (targetInput.value >= 0 ) {
        savingTarget = Number(targetInput.value)
        updateTarget(savingTarget)
        targetModal.classList.remove("hidden")
        updateLocalStorage(undefined, undefined, savingTarget)
    } else {
        targetInput.value = savingTarget
    }
}




closeTargetPopupBtn.addEventListener("click", ()=> {
    targetModal.classList.add("hidden")
})
closeRepeatPopupBtn.addEventListener("click", ()=> {
    repeatModal.classList.add("hidden")
})
closeDifferencePopupBtn.addEventListener("click", ()=> {
    differenceModal.classList.add("hidden")
})


addTargetBtn.addEventListener("click", (e)=> {
    e.preventDefault()
    targetModal.classList.remove("hidden")
    if (savingTarget) {
        targetInput.value = savingTarget
    } else {
        targetInput.value = ""
    }
})

saveTargetBtn.addEventListener("click", (e)=>{
    e.preventDefault()
    addTarget()
    targetModal.classList.add("hidden")
})



function addSaving(saving) {


    let savingText = String(textInput.value.trim())
    let savingCost = Number(costInput.value)

    if(saving) {
        savingText = saving.text
        savingCost = saving.cost     
    }



    if(savingText && savingCost) {
        const savingEl = document.createElement("div")
        savingEl.classList.add("saving-el")
        savingEl.innerHTML=`
        <li>${savingText} <span>(£${savingCost.toFixed(2)})</span></li>
        `
        //adding repeat Btn to saving item
        const repeatBtn = document.createElement("button")
        repeatBtn.innerHTML= `<i class="fa fa-rotate" id="repeat-btn" aria-hidden="true"></i>`
        repeatBtn.classList.add("repeat-btn")
        repeatBtn.setAttribute("title", "Repeat")
        savingEl.appendChild(repeatBtn)


        //adding delete Btn to saving item
        const deleteBtn = document.createElement("button")
        deleteBtn.innerHTML='<i class="fa fa-trash" aria-hidden="true"></i>'
        deleteBtn.classList.add("delete-btn")
        deleteBtn.setAttribute("title", "Delete")
        savingEl.appendChild(deleteBtn)

        savingUl.insertBefore(savingEl, savingUl.firstChild)

        //resetting form input values
        textInput.value=""
        costInput.value=""

        if(!saving) {
            updateLocalStorage(savingText,savingCost)
            updateSavings()
            updateTarget(savingTarget)
        }

    

        deleteBtn.addEventListener("click", ()=> {
            deleteFromLocalStorage(savingText, savingCost, undefined)
            savingEl.remove()
            updateTarget(savingTarget)
        })

        
        repeatBtn.addEventListener("click", ()=> {
            repeatModal.classList.remove("hidden")
            const savingIndex = getSavingIndex(savingText, savingCost)
            if(savingIndex > -1) {
                repeatForm.setAttribute('data-id', savingIndex)
                if(!savings[savingIndex].days) {
                    clearRepeatBtn.classList.add("hidden")   
                    dayInput.value=""
                    occurenceInput.value=""
                    const date=DateTime.now().toISODate()
                    dateInput.value=String(date)
                } else {
                    clearRepeatBtn.classList.remove("hidden")
                    dayInput.value = savings[savingIndex].days
                    occurenceInput.value = savings[savingIndex].occurence 
                    dateInput.value = savings[savingIndex].repeat_started 

                }
            }

        })

            
    }


}

clearRepeatBtn.addEventListener("click", (e)=> {
    e.preventDefault()
    const index=repeatForm.getAttribute('data-id')
    insertToCurrentSaving(index, 0, 0)
    repeatIconUnload(index)
    repeatModal.classList.add("hidden")
})

saveRepeatBtn.addEventListener("click", (e)=> {
    e.preventDefault()
    const index=repeatForm.getAttribute('data-id')
    dateValue = String(dateInput.value)
    if (dateValue) {
        insertRepeatedDate(index, dateValue)
        insertDaysToSaving(index)
        repeatModal.classList.add("hidden")
    } else {
        alert("Please enter a valid date.")
    }
})



function updateSavings() {

    localStorage.setItem('savings', JSON.stringify(savings))

    //updating totalSaving LS
    totalSavings=0
    savings.forEach(saving => {
        totalSavings+=saving.cost
    })

    localStorage.setItem('totalSavings', JSON.stringify(totalSavings))

}

function updateLocalStorage(string,number, target) {
    if (!string && !number) {
        localStorage.setItem('savingTarget', JSON.stringify(target))
    } else {
        //updating saving LS
        const date = DateTime.now().toISODate()
        savings.push({
            text: string,
            cost: number,
            created_on: date
        })
    }
}

function deleteFromLocalStorage(text, cost) {
    savings =JSON.parse(localStorage.getItem('savings'))
    const savingIndex = getSavingIndex(text, cost)
    if (savingIndex > -1) {
        savings.splice(savingIndex, 1 )
        updateSavings()
    }
}

function getSavingIndex(text, cost) {
    let savingIndex = [...savings.keys()].filter(i => savings[i].text === text).filter(j=>savings[j].cost ===cost)[0]
    if (savingIndex === undefined)
        savingIndex = [...savings.keys()].filter(i => savings[i].text === text)[0]
    if (savingIndex===undefined)
        alert("There was an error selecting the right saving. Please try again later.")
    return savingIndex
}



function loadFromLocalStorage() {
    if (savings) {
        savings.forEach(saving => {
            addSaving(saving)
        })
    } else {
        savings=[]
    }
    
    if(!totalSavings) {
        totalSavings = 0
    }

    if(!savingTarget) {
        savingTarget= 0
    }

    updateTarget(savingTarget)
}



function showConfetti() {
    var confettiSettings = { target: 'my-canvas' };
    var confetti = new ConfettiGenerator(confettiSettings);
    setTimeout(() => {
        confetti.render();        
    }, 500);
    setTimeout(() => {
        confetti.clear()
    }, 5000);
}


function insertRepeatedDate(index, date) {
    //add inputted repeat start date to saving item being clicked on
        const currentSaving = savings[index]
        currentSaving['repeat_started'] = date
        // store to local storage
        localStorage.setItem('savings', JSON.stringify(savings))
}

function insertDaysToSaving(index) {
    const dayValue= Number(dayInput.value)
    const occurenceValue = Number(occurenceInput.value)
    const repeatBtns= document.querySelectorAll("#repeat-btn")
    const repeatBtnClicked = repeatBtns[repeatBtns.length-1-index]
    if(dayValue > 0 && occurenceValue > 0 && (Number.isInteger(dayValue)) && (Number.isInteger(occurenceValue)) ) {
        insertToCurrentSaving(index, dayValue, occurenceValue)
        repeatBtnClicked.classList.add("active")
    } 

}


function insertToCurrentSaving(index, dayValue, occurenceValue) {
    const currentSaving = savings[index]
    currentSaving['days'] = dayValue
    currentSaving['occurence'] = occurenceValue
    localStorage.setItem('savings', JSON.stringify(savings))
}


function repeatIconLoad(value) {
    const repeatBtns= document.querySelectorAll("#repeat-btn")
    const repeatBtnClicked = repeatBtns[repeatBtns.length-1-value]
    repeatBtnClicked.classList.add("active")
}

function repeatIconUnload(value) {
    const repeatBtns= document.querySelectorAll("#repeat-btn")
    const repeatBtnClicked = repeatBtns[repeatBtns.length-1-value]
    repeatBtnClicked.classList.remove("active")
}



for (let [index, saving] of savings.entries()) {
    const dateRightNow = DateTime.now().toISODate()

    const dateRightNowParsed = DateTime.fromISO(dateRightNow)
    if(saving.days) {
        const currentSaving = savings[index]
        //number of days elapsed
        const savingDateParsed = DateTime.fromISO(currentSaving.repeat_started)
        const difference = dateRightNowParsed.diff(savingDateParsed, 'days')
        const diffDays = difference.days
        const setDays = saving.days
        const occurenceCounter =  Math.floor(diffDays/setDays)
        const setOccurence = saving.occurence
        
        if(!currentSaving["originalCost"]) {
            setCookie(saving.text, saving.cost, setDays+365)
            currentSaving["originalCost"] = Number(getCookie(saving.text))
        }

        maxEllapsedDays = setOccurence * setDays


        //if page loads within maxEllapsedDays

        if ( diffDays > 0 && diffDays < maxEllapsedDays) {
            if(saving.runningTotal) {
                currentSaving['cost'] = currentSaving["runningTotal"] + ( currentSaving["originalCost"] * (occurenceCounter))
            } else {
                currentSaving['cost'] = currentSaving['originalCost'] * (occurenceCounter+1)
            }
            localStorage.setItem('savings', JSON.stringify(savings))
        } else if (diffDays>=maxEllapsedDays && diffDays > 0) {
            if(saving.runningTotal) {
                currentSaving['cost'] =currentSaving["runningTotal"] +( currentSaving["originalCost"] * (setOccurence))
            } else {
                currentSaving['cost'] =currentSaving["originalCost"] * (setOccurence + 1)
            }
            currentSaving['runningTotal'] = currentSaving['cost']
            currentSaving['days'] = 0
            currentSaving['occurence'] = 0
            currentSaving['repeat_started'] = ""
            localStorage.setItem('savings', JSON.stringify(savings))
            const repeatBtns= document.querySelectorAll("#repeat-btn")
            const repeatBtnClicked = repeatBtns[repeatBtns.length-1-index]
            repeatBtnClicked.classList.remove("active")
        } else if (diffDays<=0 && (currentSaving["cost"]!==currentSaving["originalCost"])) {
            if(saving.runningTotal) {
                currentSaving['cost'] = currentSaving["runningTotal"] 
            } else {
                currentSaving['cost'] = currentSaving['originalCost']
            }
        }

        updateSavings()
        updateTarget(savingTarget)
        
    }  

    if (saving.originalCost) {
        const currentSaving = savings[index]
        const savingUlChildrenLength=savingUl.childNodes.length
        savingUl.childNodes[savingUlChildrenLength-1-index].firstElementChild.lastElementChild.innerHTML=`(£${currentSaving['originalCost'].toFixed(2)}, so far: £${currentSaving['cost'].toFixed(2)})`
    }
}


function setCookie(cname, cvalue, exmins) {
    const d = new Date();
    d.setTime(d.getTime() + (exmins * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return false;
}


// onboarding screen

// buttons
const onboardingBtn = document.querySelector("#onboarding-btn")
const skipBtn = document.querySelector("#skip-btn")
const nextBtn = document.querySelector(".next-btn")
const prevBtn = document.querySelector(".prev-btn")



const steps = document.querySelectorAll(".onboarding-container .step")
const dots = document.querySelectorAll(".onboarding-container .dot")
const stepsContainer = document.querySelector(".onboarding-container .steps")
const onboardingContainer = document.querySelector(".onboarding-container")
const onboardingOverlay = document.querySelector(".onboarding-overlay")

let stepPosition = 0;
let currentStep = 0;

function init() {
    stepsContainer.style.transition="unset";
    onboardingContainer.classList.add("active")
    onboardingOverlay.classList.add("active")
    currentStep=0
    stepPosition=0
    dots.forEach(dot => {
        dot.classList.remove("active")
    });
    dots[currentStep].classList.add("active")
    stepsContainer.style.transform=`translateX(-${stepPosition}px)`;
    nextBtn.textContent="next";
}


// info btn clicked
onboardingBtn.addEventListener("click", ()=> {
    init()
})

prevBtn.addEventListener("click", () => {

    if (currentStep <=0) {
       return
    }

    if (currentStep < steps.length) {
        nextBtn.textContent="next";
    }
    currentStep--
    stepsContainer.style.transition="all 0.4s ease"
    stepPosition -= steps[0].offsetWidth;
    stepsContainer.style.transform=`translateX(-${stepPosition}px)`;
    dots.forEach(dot => {
        dot.classList.remove("active")
    });
    dots[currentStep].classList.add("active")
})

// closeInfo btn clicked
skipBtn.addEventListener("click", ()=> {
    onboardingContainer.classList.remove("active")
    onboardingOverlay.classList.remove("active")
})

// next btn clicked
nextBtn.addEventListener("click", ()=> {
    currentStep++
    stepsContainer.style.transition="all 0.4s ease"


    if (currentStep >= steps.length ) {
        stepsContainer.style.transition="unset";
        onboardingContainer.classList.toggle("active")
        onboardingOverlay.classList.toggle("active")
        currentStep=0
    }

    stepPosition += steps[0].offsetWidth;
    stepsContainer.style.transform=`translateX(-${stepPosition}px)`;
    dots.forEach(dot => {
        dot.classList.remove("active")
    });
    dots[currentStep].classList.add("active")

    if(currentStep===steps.length - 1) {
        nextBtn.textContent="finish";
    }
})


//difference btn clicked 

const oldCostInput = document.getElementById("old-cost-input") 
const newCostInput = document.getElementById("new-cost-input") 
const calculateDifferenceBtn = document.getElementById("calculate-difference-btn")

differenceBtn.addEventListener("click", (e)=> {
    differenceModal.classList.remove("hidden")
})


calculateDifferenceBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const originalValue = Number(oldCostInput.value)
    const newValue = Number(newCostInput.value)
    calculateDifference(originalValue, newValue)
})



function calculateDifference(oldCost, newCost) {
    if (!oldCost || !newCost ) {
        alert("Please don't leave any cost fields blank")
    }
    else if (oldCost===newCost) {
        alert("The Original and New Cost can't be the same!")
    } else {
        const differenceValue = oldCost-newCost
        costInput.value = differenceValue.toFixed(2)
        oldCostInput.value = ""
        newCostInput.value = ""
        differenceModal.classList.add("hidden")
        if (textInput.value) {
            addSaving()
        } else {
            textInput.focus()
        }
    }
}

