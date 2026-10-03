/* ==========================================================================
   ÓTICAS MOSAICO — JavaScript (Vanilla JS, sem dependências)
   ========================================================================== */

(() => {
  "use strict";

  /* ========================================================================
     CONFIGURAÇÃO — edite apenas este bloco
     ======================================================================== */

  // Número do WhatsApp só com dígitos: código do país + DDD + número.
  // Exemplo de formato: "5561900000000"
  const WHATSAPP_NUMBER = "INSERIR_NUMERO_AQUI";

  // Link do Google Maps da loja (botão "Como chegar").
  // Enquanto não for definido, o botão abre uma busca por Águas Claras.
  const MAPS_URL = "INSERIR_LINK_GOOGLE_MAPS";

  const INSTAGRAM_URL = "https://www.instagram.com/oticasmosaico/";

  // Endpoint do backend Spring Boot. Se o site estiver hospedado sem backend,
  // o formulário cai automaticamente para o WhatsApp.
  const BOOKING_API = "/api/agendamentos";

  const WHATSAPP_MESSAGES = {
    consultor: "Olá! Gostaria de falar com um consultor da Óticas Mosaico.",
    exame: "Olá! Gostaria de agendar um exame de vista na Óticas Mosaico.",
  };

  // Destino de cada categoria da coleção. Quando existir uma página própria,
  // preencha "url" (ex.: "/colecao/oculos-de-grau.html").
  // Com url = null, o clique leva ao consultor (WhatsApp ou formulário).
  const CATEGORY_ROUTES = {
    "oculos-de-grau": { url: null, label: "óculos de grau", service: "Óculos de grau" },
    "oculos-de-sol": { url: null, label: "óculos de sol", service: "Óculos de sol" },
    "marcas": { url: "#marcas", label: "marcas" },
    "novidades": { url: null, label: "novidades", service: "Consultoria de estilo" },
  };

  // Mesma lógica para os estilos da seção "Qual é o seu estilo?".
  const STYLE_ROUTES = {
    minimalista: { url: null, label: "Minimalista" },
    classico: { url: null, label: "Clássico" },
    contemporaneo: { url: null, label: "Contemporâneo" },
    ousado: { url: null, label: "Ousado" },
    sofisticado: { url: null, label: "Sofisticado" },
  };


  /* ========================================================================
     UTILITÁRIOS
     ======================================================================== */

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const isConfigured = (value) => Boolean(value) && !value.startsWith("INSERIR");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let toastTimer;
  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;

    // Um <dialog> aberto fica na camada superior; o aviso precisa estar dentro dele para aparecer.
    const openDialog = $("dialog[open]");
    (openDialog || document.body).appendChild(toast);

    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 4200);
  }

  function scrollToTarget(hash) {
    const target = $(hash);
    if (!target) return;
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  }


  /* ========================================================================
     WHATSAPP
     ======================================================================== */

  function buildWhatsAppLink(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  // Retorna false quando o número ainda não foi configurado.
  function openWhatsApp(message) {
    if (!isConfigured(WHATSAPP_NUMBER)) {
      console.warn("[Óticas Mosaico] Defina WHATSAPP_NUMBER em js/script.js.");
      return false;
    }
    window.open(buildWhatsAppLink(message), "_blank", "noopener");
    return true;
  }

  function initWhatsAppButtons() {
    $$("[data-whatsapp]").forEach((el) => {
      el.addEventListener("click", (event) => {
        event.preventDefault();
        const key = el.dataset.whatsapp;
        const opened = openWhatsApp(WHATSAPP_MESSAGES[key] || WHATSAPP_MESSAGES.consultor);
        if (opened) return;

        // Sem número configurado: o agendamento continua possível pelo formulário.
        if (key === "exame") {
          openBooking("Exame de vista");
        } else {
          showToast("O WhatsApp da loja ainda não foi configurado. Use o formulário de agendamento.");
        }
      });
    });
  }


  /* ========================================================================
     LINKS EXTERNOS (Maps e Instagram)
     ======================================================================== */

  function initExternalLinks() {
    const mapsHref = isConfigured(MAPS_URL)
      ? MAPS_URL
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Águas Claras, Brasília - DF")}`;

    $$("[data-maps]").forEach((el) => { el.href = mapsHref; });
    $$("[data-instagram]").forEach((el) => { el.href = INSTAGRAM_URL; });
  }


  /* ========================================================================
     HEADER DINÂMICO + BOTÃO FLUTUANTE
     ======================================================================== */

  function initHeader() {
    const header = $("#header");
    const floatButton = $(".float-whatsapp");
    if (!header) return;

    let lastY = window.scrollY;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      const goingDown = y > lastY;

      header.classList.toggle("is-scrolled", y > 40);
      // Esconde ao descer e reaparece ao subir, para dar espaço às imagens.
      header.classList.toggle("is-hidden", goingDown && y > window.innerHeight * 0.9);

      if (floatButton) {
        floatButton.classList.toggle("is-visible", y > window.innerHeight * 0.8);
      }

      lastY = y;
      ticking = false;
    }

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }


  /* ========================================================================
     MENU MOBILE
     ======================================================================== */

  function initMobileMenu() {
    const header = $("#header");
    const toggle = $(".header__toggle");
    const menu = $("#menu-mobile");
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.classList.toggle("is-open", open);
      menu.inert = !open;
      menu.setAttribute("aria-hidden", String(!open));
      header.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      document.body.style.overflow = open ? "hidden" : "";

      if (open) {
        const firstLink = $("a", menu);
        if (firstLink) setTimeout(() => firstLink.focus(), 200);
      }
    }

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Fecha ao escolher um destino (links e botão de agendar)
    $$("a, button", menu).forEach((el) => el.addEventListener("click", () => setOpen(false)));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.matchMedia("(min-width: 1201px)").addEventListener("change", (event) => {
      if (event.matches) setOpen(false);
    });
  }


  /* ========================================================================
     ANIMAÇÕES DE ENTRADA (Intersection Observer)
     ======================================================================== */

  function initReveal() {
    const elements = $$("[data-reveal]");

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    elements.forEach((el) => observer.observe(el));
  }


  /* ========================================================================
     CATEGORIAS DA COLEÇÃO
     ======================================================================== */

  function initCategories() {
    $$("[data-route]").forEach((el) => {
      el.addEventListener("click", (event) => {
        const route = CATEGORY_ROUTES[el.dataset.route];
        if (!route) return;
        event.preventDefault();

        if (route.url) {
          if (route.url.startsWith("#")) scrollToTarget(route.url);
          else window.location.href = route.url;
          return;
        }

        const message = `Olá! Gostaria de conhecer a seleção de ${route.label} da Óticas Mosaico.`;
        if (!openWhatsApp(message)) openBooking(route.service);
      });
    });
  }


  /* ========================================================================
     ESTILOS ("Qual é o seu estilo?")
     ======================================================================== */

  function initStyles() {
    const track = $(".styles__track");
    const result = $("#style-result");
    if (!track || !result) return;

    const cards = $$("[data-style]", track);
    const nameEl = $("[data-style-name]", result);
    const cta = $("[data-style-cta]", result);
    let selected = null;

    cards.forEach((card) => {
      card.setAttribute("aria-pressed", "false");

      card.addEventListener("click", () => {
        const key = card.dataset.style;
        const style = STYLE_ROUTES[key];
        if (!style) return;

        // Estrutura pronta para levar a uma página de categoria
        if (style.url) {
          window.location.href = style.url;
          return;
        }

        selected = key;
        cards.forEach((c) => {
          const active = c === card;
          c.classList.toggle("is-selected", active);
          c.setAttribute("aria-pressed", String(active));
        });
        track.classList.add("has-selection");

        nameEl.textContent = style.label;
        result.hidden = false;
      });
    });

    cta.addEventListener("click", () => {
      const style = STYLE_ROUTES[selected];
      if (!style) return;
      const message = `Olá! Meu estilo é ${style.label}. Gostaria de ver uma seleção de armações da Óticas Mosaico.`;
      if (!openWhatsApp(message)) {
        openBooking("Consultoria de estilo", `Estilo: ${style.label}`);
      }
    });
  }


  /* ========================================================================
     MODAL DE AGENDAMENTO + FORMULÁRIO
     ======================================================================== */

  const dialog = $("#booking");
  const form = $("#booking-form");
  let lastBookingMessage = WHATSAPP_MESSAGES.exame;

  function openBooking(service, note) {
    if (!dialog) return;

    $(".booking__form-view", dialog).hidden = false;
    $(".booking__success", dialog).hidden = true;

    if (service) form.elements.servico.value = service;
    if (note && !form.elements.mensagem.value) form.elements.mensagem.value = note;

    dialog.classList.remove("is-closing");
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
  }

  function closeBooking() {
    if (!dialog || !dialog.open) return;

    if (prefersReducedMotion) {
      dialog.close();
      return;
    }

    const finish = () => {
      if (!dialog.classList.contains("is-closing")) return;
      dialog.classList.remove("is-closing");
      dialog.close();
    };

    dialog.classList.add("is-closing");
    dialog.addEventListener("animationend", finish, { once: true });
    setTimeout(finish, 450); // garante o fechamento mesmo sem animação
  }

  // Máscara simples: (61) 90000-0000
  function formatPhone(value) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : "";
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function setFieldError(input, message) {
    const field = input.closest(".form__field");
    const errorEl = field ? $(".form__error", field) : $(".form__error--check", form);
    if (field) field.classList.toggle("has-error", Boolean(message));
    if (errorEl) errorEl.textContent = message || "";
    input.setAttribute("aria-invalid", String(Boolean(message)));
  }

  function validateForm() {
    const { nome, telefone, consentimento } = form.elements;
    let firstInvalid = null;

    const checks = [
      [nome, nome.value.trim().length >= 2 ? "" : "Informe seu nome."],
      [telefone, /^\d{10,11}$/.test(telefone.value.replace(/\D/g, "")) ? "" : "Informe um WhatsApp válido com DDD."],
      [consentimento, consentimento.checked ? "" : "Precisamos da sua autorização para entrar em contato."],
    ];

    checks.forEach(([input, message]) => {
      setFieldError(input, message);
      if (message && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function buildBookingMessage(data) {
    const lines = [
      "Olá! Gostaria de agendar um horário na Óticas Mosaico.",
      `Nome: ${data.nome}`,
      `Interesse: ${data.servico}`,
      `Período: ${data.periodo}`,
    ];
    if (data.dataPreferida) {
      lines.push(`Data preferida: ${data.dataPreferida.split("-").reverse().join("/")}`);
    }
    if (data.mensagem) lines.push(`Observações: ${data.mensagem}`);
    return lines.join("\n");
  }

  function showSuccess(data, protocol) {
    const success = $(".booking__success", dialog);
    $(".booking__form-view", dialog).hidden = true;
    success.hidden = false;

    $("[data-success-name]", success).textContent = `${data.nome.split(" ")[0]}.`;
    $("[data-success-text]", success).textContent = protocol
      ? `Recebemos sua solicitação (protocolo ${protocol}). Em breve nossa equipe entrará em contato para confirmar seu horário.`
      : "Para concluir, confirme sua solicitação com nossa equipe pelo WhatsApp.";

    success.focus();
  }

  async function sendBooking(data) {
    const response = await fetch(BOOKING_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return response.json();
  }

  function initBooking() {
    if (!dialog || !form) return;

    $$("[data-open-booking]").forEach((btn) => {
      btn.addEventListener("click", () => openBooking(btn.dataset.service));
    });

    $$("[data-close-booking]", dialog).forEach((btn) => btn.addEventListener("click", closeBooking));

    // Esc: usa a mesma animação de saída
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeBooking();
    });

    // Clique fora do painel (no backdrop)
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeBooking();
    });

    dialog.addEventListener("close", () => {
      document.body.style.overflow = "";
    });

    form.elements.telefone.addEventListener("input", (event) => {
      event.target.value = formatPhone(event.target.value);
    });

    // Limpa o erro assim que o campo é corrigido
    form.addEventListener("input", (event) => {
      if (event.target.getAttribute("aria-invalid") === "true") setFieldError(event.target, "");
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!validateForm()) return;

      const submit = $("button[type='submit']", form);
      const formData = new FormData(form);
      const data = {
        nome: formData.get("nome").trim(),
        telefone: formData.get("telefone").replace(/\D/g, ""),
        servico: formData.get("servico"),
        periodo: formData.get("periodo"),
        dataPreferida: formData.get("dataPreferida") || null,
        mensagem: formData.get("mensagem").trim() || null,
      };

      lastBookingMessage = buildBookingMessage(data);
      submit.disabled = true;
      submit.textContent = "Enviando…";

      try {
        const result = await sendBooking(data);
        showSuccess(data, result.protocolo);
        form.reset();
      } catch (error) {
        if (error.status === 400) {
          showToast("Revise os dados informados e tente novamente.");
        } else {
          // Sem backend disponível (ex.: site estático): segue pelo WhatsApp.
          showSuccess(data, null);
        }
      } finally {
        submit.disabled = false;
        submit.textContent = "Solicitar agendamento";
      }
    });

    $("[data-success-whatsapp]", dialog).addEventListener("click", () => {
      if (!openWhatsApp(lastBookingMessage)) {
        showToast("O WhatsApp da loja ainda não foi configurado.");
      }
    });
  }


  /* ========================================================================
     INICIALIZAÇÃO
     ======================================================================== */

  function init() {
    initHeader();
    initMobileMenu();
    initReveal();
    initCategories();
    initStyles();
    initBooking();
    initWhatsAppButtons();
    initExternalLinks();

    $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

    // Dispara a entrada do hero no próximo quadro
    requestAnimationFrame(() => document.documentElement.classList.add("is-loaded"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
