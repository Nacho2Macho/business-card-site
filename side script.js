$(document).ready(function () {
  $(".slider").slick({
    arrows: true,
    dots: true,
    slidesToShow: 3,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1800,
    pauseOnHover: true,
    variableWidth: false,
  });
});

const TOKEN = "5734575735:AAGSJQIYKRyA2Rtllz46541kz64403oDRC8";
const CHAT_ID = "-1001783334696";
const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
const success = document.getElementById("success");
const error = document.getElementById("error");
const zakazError = document.getElementById("zakaz_error");

function validateTel(tel) {
  let re = /^[0-9\s]*$/;
  return re.test(String(tel));
}

function validateEmail(email) {
  return !!String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function sendMessage(message) {
  console.log(message);
  axios
    .post(URI_API, {
      chat_id: CHAT_ID,
      parse_mode: "html",
      text: message,
    })
    .then((res) => {
      success.innerHTML = "Сообщение отправлено";
      success.style.display = "block";
    })
    .catch((err) => {
      console.warn(err);
    })
    .finally(() => {
      console.log("Конец");
    });
}

document.getElementById("zakaz").addEventListener("submit", function (e) {
  e.preventDefault();
  zakazError.style.display = "none";

  const name = this.name.value;
  const mail = this.mail.value;
  const tel = this.tel.value;

  const mailIsValid = validateEmail(mail);
  const telIsValid = validateTel(tel);

  const isValid = mailIsValid && telIsValid;
  console.log(telIsValid, mailIsValid);

  if (telIsValid === false) {
    zakazError.innerText = "Неправильно введён номер телефона";
    zakazError.style.display = "block";
  }

  if (mailIsValid === false) {
    zakazError.innerText = "Неправильно введена почта";
    zakazError.style.display = "block";
  }

  let message = `<b>Заказать звонок</b>\n`;
  message += `<b>Отправитель: </b> ${name}\n`;
  message += `<b>Почта: </b> ${mail}\n`;
  message += `<b>Номер телефона: </b> ${tel}`;

  if (isValid) {
    sendMessage(message);
    this.name.value = "";
    this.mail.value = "";
    this.tel.value = "";
  }
});

let form = document.querySelector(".popup"),
  formInputs = document.querySelectorAll(".js-input"),
  inputTel = document.querySelector(".js-input-tel"),
  inputName = document.querySelector(".js-input-name");

form.onsubmit = function (e) {
  let telVal = inputTel.value;
  let isValid = inputName.value !== "" && validateTel(telVal);
  error.style.display = "none";
  success.style.display = "none";

  if (isValid) {
    let message = `<b>Заявка с сайта!</b>\n`;
    message += `<b>Отправитель: </b> ${inputName.value}\n`;
    message += `<b>Номер телефона: </b> ${inputTel.value}`;
    sendMessage(message);

    inputName.value = "";
    inputTel.value = "";

    inputTel.classList.remove("error");
  } else {
    inputTel.classList.add("error");
    error.innerHTML = "Неверный формат номера";
    error.style.display = "block";
  }
  return false;
};
