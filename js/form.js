document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const successBox = document.getElementById('success-box');
  const btnResetForm = document.getElementById('btn-reset-form');

  //Cria e injeta o script do EmailJS
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
  script.type = 'text/javascript';
  document.head.appendChild(script);

  //Inicializa o EmailJS assim que o script terminar de carregar
  script.onload = function() {
      emailjs.init("OjFuqLsTf8livxHig"); 
      console.log("EmailJS pronto para uso!");
  };

  //Função para restaurar o texto padrão do box de sucesso
  function resetSuccessBoxText() {
    successBox.querySelector(".title").innerText = "Message sent.";
    successBox.querySelector("p").innerText = "I'll get back to you within 48 hours.";
    btnResetForm.innerText = "Send another →";
  }

  //Modificada para lidar com a interface baseada no resultado
  async function sendEmail() {
    const templateParams = {
      from_email: document.getElementById("inp-email").value,
      from_name: document.getElementById("inp-name").value,
      message: document.getElementById("inp-msg").value
    };

    //Certifica que o texto padrão está limpo antes de exibir
    resetSuccessBoxText();

    //Desativa o botão de envio ou muda o estado visual enquanto carrega (opcional, mas bom)
    contactForm.style.display = 'none';
    successBox.classList.add('show');
    successBox.querySelector(".title").innerText = "Sending...";

    emailjs.send('service_dlmeneguin', 'template_t7qir5v', templateParams)
      .then((response) => {
         console.log('SUCCESS!', response.status, response.text);
         //Restaura para o texto de sucesso real
         resetSuccessBoxText();
      }, (error) => {
         console.log('FAILED...', error);
         
         //Altera os textos exibindo o erro capturado corretamente neste escopo
         successBox.querySelector(".title").innerText = "Email failed";
         
         const errorMessage = error.text || error.message || JSON.stringify(error);
         successBox.querySelector("p").innerText = `(${errorMessage}) If the error persists, send an email directly to dl.meneguin@gmail.com`;
         
         btnResetForm.innerText = "Try again";
      });
  }

  if (contactForm && successBox) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      //Executa a função assíncrona que gerencia o fluxo visual internamente
      sendEmail();
    });
  }

  if (btnResetForm && contactForm && successBox) {
    btnResetForm.addEventListener('click', () => {
      contactForm.reset();
      contactForm.style.display = 'block';
      successBox.classList.remove('show');
    });
  }
});