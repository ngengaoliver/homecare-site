/* Kamamie Quickfast Homecare — site interactions */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var body = document.body;

  /* ---------------------------------------------------------------- header */
  function syncHeader() {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 8);
  }
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  /* ------------------------------------------------------------ mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.querySelector(".mobile-nav");

  function setDrawer(open) {
    if (!toggle || !drawer) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    drawer.classList.toggle("is-open", open);
    body.classList.toggle("is-locked", open);
  }

  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      setDrawer(toggle.getAttribute("aria-expanded") !== "true");
    });

    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) setDrawer(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        setDrawer(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (!drawer.classList.contains("is-open")) return;
      if (e.target.closest(".mobile-nav") || e.target.closest(".nav-toggle")) return;
      setDrawer(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) setDrawer(false);
    });
  }

  /* -------------------------------------------------------------- accordion */
  document.querySelectorAll("[data-accordion]").forEach(function (item) {
    var btn = item.querySelector(".faq-item__btn");
    var panel = item.querySelector(".faq-item__panel");
    if (!btn || !panel) return;

    btn.addEventListener("click", function () {
      var open = item.classList.contains("is-open");
      item.classList.toggle("is-open", !open);
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      panel.setAttribute("aria-hidden", open ? "true" : "false");
    });
  });

  /* ----------------------------------------------------------- reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ------------------------------------------------------------- scroll spy */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav__link[data-spy]")
  );
  if (navLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return;
      byId[href] = link;
    });

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = byId["#" + entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) {
              l.classList.remove("is-active");
            });
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    Object.keys(byId).forEach(function (hash) {
      var section = document.querySelector(hash);
      if (section) spy.observe(section);
    });
  }

  /* ------------------------------------------------------------ enquiry form */
  var FORMSPREE = "https://formspree.io/f/xdkzwvvy";
  var WHATSAPP_NUMBER = "254711105620";
  var PHONE_DISPLAY = "+254 711 105620";

  var form = document.getElementById("enquiry-form");
  if (!form) return;

  var status = document.querySelector(".form-status");
  var panel = document.querySelector(".enquiry__form-panel");
  var success = document.querySelector(".enquiry__success");
  var submit = form.querySelector("[type=submit]");

  function buildWhatsAppLink() {
    var name = (form.elements.name.value || "").trim();
    var phone = (form.elements.phone.value || "").trim();
    var email = (form.elements.email.value || "").trim();
    var service = (form.elements.service.value || "").trim();
    var message = (form.elements.message.value || "").trim();

    var parts = ["Hello Kamamie Quickfast Homecare, I would like to enquire about homecare support."];
    if (name) parts.push("Name: " + name);
    if (service) parts.push("Support needed: " + service);
    if (phone) parts.push("Phone: " + phone);
    if (email) parts.push("Email: " + email);
    if (message) parts.push("Details: " + message);

    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(parts.join("\n"));
  }

  function setError(field, on) {
    if (!field) return;
    field.setAttribute("data-invalid", on ? "true" : "false");
    var input = field.querySelector("input, select, textarea");
    if (input) input.setAttribute("aria-invalid", on ? "true" : "false");
  }

  function icon(kind) {
    return (
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (kind === "ok"
        ? '<path d="M20 6L9 17l-5-5"/>'
        : '<circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/>') +
      "</svg>"
    );
  }

  function showStatus(kind, title, text) {
    if (!status) return;
    status.className = "form-status is-visible form-status--" + kind;
    status.innerHTML =
      icon(kind) +
      "<span><strong>" +
      title +
      "</strong><span>" +
      text +
      "</span></span>";
  }

  function showDeliveryError() {
    if (!status) return;
    status.className = "form-status is-visible form-status--err";
    status.innerHTML =
      icon("err") +
      "<span><strong>We could not send that through the online form.</strong>" +
      "<span>Your details are safe — nothing was lost. You can still reach us straight away:</span>" +
      '<span class="form-status__actions">' +
      '<a class="btn btn--forest" href="tel:+254711105620">Call ' +
      PHONE_DISPLAY +
      "</a>" +
      '<a class="btn btn--primary" href="' +
      buildWhatsAppLink() +
      '" target="_blank" rel="noopener">Send via WhatsApp</a>' +
      "</span></span>";
  }

  function clearStatus() {
    if (!status) return;
    status.className = "form-status";
    status.innerHTML = "";
  }

  function validate() {
    var ok = true;
    var fields = {
      name: form.querySelector('[data-field="name"]'),
      contact: form.querySelector('[data-field="contact"]'),
      service: form.querySelector('[data-field="service"]')
    };

    var name = form.elements.name;
    var phone = form.elements.phone;
    var email = form.elements.email;
    var service = form.elements.service;

    if (!name.value.trim()) {
      setError(fields.name, true);
      ok = false;
    } else {
      setError(fields.name, false);
    }

    var hasPhone = phone && phone.value.trim().length >= 7;
    var hasEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if (!hasPhone && !hasEmail) {
      setError(fields.contact, true);
      ok = false;
    } else {
      setError(fields.contact, false);
    }

    if (!service.value) {
      setError(fields.service, true);
      ok = false;
    } else {
      setError(fields.service, false);
    }

    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearStatus();

    if (!validate()) {
      showStatus(
        "err",
        "Please check the highlighted fields.",
        "We need your name, a way to reach you, and the kind of support you are looking for."
      );
      var firstBad = form.querySelector('[data-invalid="true"] input, [data-invalid="true"] select');
      if (firstBad) firstBad.focus();
      return;
    }
    var label = submit.textContent;
    submit.disabled = true;
    submit.textContent = "Sending...";

    var data = new FormData(form);
    data.set("_subject", "New care enquiry — Kamamie Quickfast Homecare");

    fetch(FORMSPREE, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        return res.json().then(function (payload) {
          return { ok: res.ok, payload: payload };
        });
      })
      .then(function (result) {
        if (result.ok) {
          form.reset();
          if (panel) panel.style.display = "none";
          if (success) {
            success.classList.add("is-visible");
            success.setAttribute("tabindex", "-1");
            success.focus();
          }
        } else {
          showDeliveryError();
        }
      })
      .catch(function () {
        showDeliveryError();
      })
      .then(function () {
        submit.disabled = false;
        submit.textContent = label;
      });
  });

  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    el.addEventListener("input", function () {
      var field = el.closest(".field");
      if (field && field.getAttribute("data-invalid") === "true") {
        setError(field, false);
      }
      clearStatus();
    });
  });
})();
