// Объект, куда будем записывать данные
var answers = {
    2: null,
    3: null,
    4: null,
    5: null,
};

// Вперед
var btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function(button) {
    button.addEventListener("click", function() {
        var thisCard = this.closest('[data-card]');
        var thisCardNumber = parseInt(thisCard.dataset.card);
        
        if (thisCard.dataset.validate == "novalidate") { 
            navigate("next", thisCard);
            updateProgressBar("next", thisCardNumber);
        } else {
            saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));

            if (isfilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
                navigate("next", thisCard);
                updateProgressBar("next", thisCardNumber);
            } else {
                alert("Выполните действие!")
            }
        }
    })
})

// Назад
var btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button) {
    button.addEventListener("click", function() {
        var thisCard = this.closest('[data-card]');
        var thisCardNumber = parseInt(thisCard.dataset.card);
        navigate("prev", thisCard);
        updateProgressBar("prev", thisCardNumber);
    })
}) 

// Определение направления перемещения
function navigate(direction, thisCard) {
    var thisCardNumber = parseInt(thisCard.dataset.card);
    var nextCard;
    
    if (direction == "next") {
        nextCard = thisCardNumber + 1;
    } else if (direction == "prev") {
        nextCard = thisCardNumber - 1;
    }

    thisCard.classList.add("hidden");
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove("hidden");
}

// Сбор данных с карточек
function gatherCardData(number) {
    var currentCard = document.querySelector(`[data-card="${number}"]`);
    var question = currentCard.querySelector("[data-question]").innerText;
    var result = [];
    var radioValues = currentCard.querySelectorAll('[type="radio"]');
    var checkboxValues = currentCard.querySelectorAll('[type="checkbox"]');
    var inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');
    var data = {
        question: question,
        answer: result
    }
    
    radioValues.forEach(function(item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    checkboxValues.forEach(function(item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    inputValues.forEach(function(item) {
        itemValue = item.value;
        if (itemValue.trim() != "") {
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    return data
}

// Запись собранных данных в объект 
function saveAnswer(number, data) {
    answers[number] = data;
}

// Проверка карточки на заполненность ответов
function isfilled(number) {
    return answers[number].answer.length > 0;
}

// Проверка заполнения обязательных полей
function checkOnRequired(number) {
    var currentCard = document.querySelector(`[data-card="${number}"]`);
    var requiredFields = currentCard.querySelectorAll("[required]");
    var isValidArray = [];

    requiredFields.forEach(function(item) {
        if (item.type == "checkbox" && item.checked == false) {
            isValidArray.push(false);
        } else if (item.type == "email") {
            if (validateEmail(item.value)) {
                isValidArray.push(true);
            } else {
                isValidArray.push(false);
            }
        }
    })

    if (isValidArray.indexOf(false) == -1) {
        return true;
    } else {
        return false;
    }
}

// Паттерн проверки корректности введенного email
function validateEmail(email) {
    var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}

// Подсветка рамки для радио-кнопок
document.querySelectorAll(".radio-group").forEach(function(item) {
    item.addEventListener("click", function(e) {
        var label = e.target.closest("label");

        if (label) {
            label.closest(".radio-group").querySelectorAll("label").forEach(function(item) {
                item.classList.remove("radio-block--active");
            })
        }
        label.classList.add("radio-block--active");
    })
})

// Подсветка рамки для чек-боксов
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item) {
    item.addEventListener("change", function() {
        if(item.checked) {
            item.closest("label")
                .classList.add("checkbox-block--active");
        } else {
            item.closest("label")
                .classList.remove("checkbox-block--active");
        }
    })
})

// Прогресс-бар
function updateProgressBar(direction, cardNumber) {
    if (direction == "next") {
        cardNumber = cardNumber + 1;
    } else if (direction == "prev") {
        cardNumber = cardNumber - 1;
    }

    var cardsTotalNumber = document.querySelectorAll("[data-card]").length;
    var progress = ((cardNumber * 100) / cardsTotalNumber).toFixed();
    var progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector(".progress");
    if (progressBar) {
        progressBar.querySelector(".progress__label strong").innerText = `${progress}%`;
        progressBar.querySelector(".progress__line-bar").style = `width: ${progress}%`; 
    }
}

    











