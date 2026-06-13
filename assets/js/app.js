// Portfolio Main Application Script
document.addEventListener("DOMContentLoaded", () => {
  const isEn = window.location.pathname.includes("/en/");
  const locale = isEn ? "en" : "id";

  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 2. Loading Screen Logic
  const loader = document.getElementById("page-loader");
  const progressBar = document.getElementById("loader-progress-bar");
  const progressText = document.getElementById("loader-progress-text");
  const welcomeText = document.getElementById("loader-greeting");

  const greetings = isEn
    ? ["welcome", "hello", "hi there", "greetings"]
    : ["selamat datang", "halo", "apa kabar", "sampurasun"];

  if (loader && progressBar && progressText && welcomeText) {
    let progress = 0;
    let greetingIndex = 0;

    const greetingInterval = setInterval(() => {
      greetingIndex = (greetingIndex + 1) % greetings.length;
      welcomeText.textContent = greetings[greetingIndex];
    }, 450);

    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        clearInterval(greetingInterval);

        welcomeText.textContent = greetings[0];

        // Fade out preloader
        gsap.to(loader, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            loader.style.display = "none";
            initScrollAnimations();
          },
        });
      }
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${progress}%`;
    }, 60);
  } else {
    initScrollAnimations();
  }

  // 3. Dynamic Rotating Text Logo
  const rotatingLogo = document.getElementById("rotating-logo");
  if (rotatingLogo) {
    const text = "RIZKI AGUNG DWI PRAYOGA * WEB DEVELOPER * ";
    rotatingLogo.innerHTML = "";
    const angleStep = 360 / text.length;

    for (let i = 0; i < text.length; i++) {
      const span = document.createElement("span");
      span.className = "absolute inline-block inset-0 text-2xl transition-all duration-500 ease-[cubic-bezier(0,0,0,1)]";
      span.textContent = text[i] === " " ? "\u00A0" : text[i];
      const angle = i * angleStep;
      span.style.transform = `rotateZ(${angle}deg) translate3d(0px, 0px, 0)`;
      span.style.webkitTransform = `rotateZ(${angle}deg) translate3d(0px, 0px, 0)`;
      rotatingLogo.appendChild(span);
    }

    rotatingLogo.classList.add("logo-spin");

    // Speed controls on hover
    rotatingLogo.addEventListener("mouseenter", () => {
      rotatingLogo.style.animationDuration = "6s";
    });
    rotatingLogo.addEventListener("mouseleave", () => {
      rotatingLogo.style.animationDuration = "20s";
    });
  }

  // 4. Hamburger Menu Overlay Navigation
  const menuBtn = document.getElementById("menu-btn");
  const navOverlay = document.getElementById("nav-overlay");
  let isNavOpen = false;

  if (menuBtn && navOverlay) {
    const lines = menuBtn.querySelectorAll("span");

    menuBtn.addEventListener("click", () => {
      isNavOpen = !isNavOpen;

      if (isNavOpen) {
        // Open Navigation Menu
        gsap.killTweensOf(navOverlay);
        navOverlay.style.display = "flex";
        gsap.fromTo(
          navOverlay,
          {
            x: "100%",
            borderTopLeftRadius: "50vh",
            borderBottomLeftRadius: "50vh",
          },
          {
            x: "0%",
            borderTopLeftRadius: "0vh",
            borderBottomLeftRadius: "0vh",
            duration: 0.8,
            ease: "power4.out",
          }
        );

        // Stagger list links in
        const links = navOverlay.querySelectorAll("a, p, div");
        gsap.fromTo(
          links,
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.04,
            delay: 0.15,
            ease: "power2.out",
          }
        );

        // Transform burger icon to close icon
        if (lines.length >= 2) {
          gsap.to(lines[0], { rotate: 45, y: 4, duration: 0.3 });
          gsap.to(lines[1], { rotate: -45, y: -4, duration: 0.3 });
        }
      } else {
        // Close Navigation Menu
        gsap.killTweensOf(navOverlay);
        gsap.to(navOverlay, {
          x: "100%",
          borderTopLeftRadius: "50vh",
          borderBottomLeftRadius: "50vh",
          duration: 0.6,
          ease: "power3.inOut",
          onComplete: () => {
            navOverlay.style.display = "none";
          },
        });

        // Transform back to burger icon
        if (lines.length >= 2) {
          gsap.to(lines[0], { rotate: 0, y: 0, duration: 0.3 });
          gsap.to(lines[1], { rotate: 0, y: 0, duration: 0.3 });
        }
      }
    });

    // Auto close menu when links are clicked
    navOverlay.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (isNavOpen) menuBtn.click();
      });
    });
  }

  // 5. Dynamic Projects Data & Modal rendering

  // Language/tech color map for gradient headers
  const langColors = {
    "Python":     ["#3b7dc4", "#1e3a5f"],
    "JavaScript": ["#f7df1e", "#b8860b"],
    "TypeScript": ["#3178c6", "#1a4580"],
    "React":      ["#61dafb", "#1a6a80"],
    "Flutter":    ["#54c5f8", "#0175c2"],
    "Dart":       ["#0175c2", "#00306b"],
    "PHP":        ["#8993c1", "#3d4078"],
    "HTML":       ["#e44d26", "#7a2010"],
    "Node.js":    ["#339933", "#1a4d1a"],
    "AI":         ["#a855f7", "#6b21a8"],
    "ML":         ["#f97316", "#9a3412"],
  };

  function getGradient(stack, tags) {
    const combined = (stack + " " + tags).toLowerCase();
    if (combined.includes("python") && (combined.includes("ai") || combined.includes("ml") || combined.includes("tensorflow"))) return langColors["AI"];
    if (combined.includes("flutter") || combined.includes("dart")) return langColors["Flutter"];
    if (combined.includes("react") || combined.includes("typescript")) return langColors["React"];
    if (combined.includes("python")) return langColors["Python"];
    if (combined.includes("node") || combined.includes("express")) return langColors["Node.js"];
    if (combined.includes("php") || combined.includes("laravel")) return langColors["PHP"];
    if (combined.includes("html") || combined.includes("css")) return langColors["HTML"];
    return ["#7163F1", "#3b2fa0"];
  }

  function getLangIcon(stack, tags) {
    const combined = (stack + " " + tags).toLowerCase();
    if (combined.includes("flutter") || combined.includes("dart")) return "📱";
    if (combined.includes("python") && (combined.includes("ai") || combined.includes("ml") || combined.includes("tensorflow"))) return "🤖";
    if (combined.includes("python")) return "🐍";
    if (combined.includes("react")) return "⚛️";
    if (combined.includes("node")) return "🟢";
    if (combined.includes("php")) return "🐘";
    return "💻";
  }

  const projects = [
    {
      id: 1,
      title: {
        id: "Deteksi Kantuk - Sistem Deteksi Kantuk Real-time dengan CNN & Metode EAR",
        en: "Drowsiness Detection - Real-time Drowsiness Detection System with CNN & EAR Method"
      },
      year: 2024,
      tags: "AI, Computer Vision, Deep Learning",
      githubLink: "https://github.com/rizkiadp/Deteksi-Kantuk-Algoritma-CNN-Dan-Metode-EAR",
      role: "Machine Learning & Web Developer",
      stack: "Python, OpenCV, TensorFlow, Keras",
      imageSrc: "/ai-plagiarism/collapse1.jpg",
      heroImage: "/ai-plagiarism/login.png",
      metric1Val: "95%",
      metric1Text: {
        id: "Tingkat Akurasi Deteksi",
        en: "Detection Accuracy Rate"
      },
      metric2Val: "Real-time",
      metric2Text: {
        id: "Pemrosesan Video Kamera",
        en: "Camera Video Processing"
      },
      challenge: {
        id: "Mengoptimalkan performa model Convolutional Neural Network (CNN) agar dapat mendeteksi kedipan mata dan status kantuk secara real-time pada perangkat dengan spesifikasi terbatas.",
        en: "Optimizing the Convolutional Neural Network (CNN) model performance to detect eye blinks and drowsiness states in real-time on hardware with limited resources."
      },
      process: {
        id: "Mengekstrak facial landmarks menggunakan pustaka OpenCV dan Dlib, mengukur rasio Eye Aspect Ratio (EAR) untuk memantau status penutupan mata pengemudi, lalu mengintegrasikan model deep learning CNN untuk melakukan klasifikasi kondisi kelelahan.",
        en: "Extracting facial landmarks using OpenCV and Dlib libraries, measuring Eye Aspect Ratio (EAR) to monitor driver eye closure, and integrating a deep learning CNN model to classify driver fatigue condition."
      },
      outcome: {
        id: "Sistem sukses mendeteksi tanda-tanda kantuk dan kelelahan secara instan dengan tingkat akurasi mencapai 95%, lengkap dengan sistem peringatan suara langsung.",
        en: "The system successfully detects drowsiness and fatigue indicators instantly with a high accuracy rate of 95%, completed with an integrated live sound alarm system."
      },
      gallery: ["/ai-plagiarism/home.png", "/ai-plagiarism/proses.png", "/ai-plagiarism/preview.png"]
    },
    {
      id: 2,
      title: {
        id: "Avalon - Platform Top Up Game Online berbasis React dan Node.js",
        en: "Avalon - Online Game Top-Up Platform with React and Node.js"
      },
      year: 2024,
      tags: "E-Commerce, Web Application, Payment Gateway",
      githubLink: "https://github.com/rizkiadp/Avalon-Top-Up-Games-Online-React-Dan-Node",
      role: "Fullstack Web Developer",
      stack: "React, TypeScript, Node.js, Express, MySQL",
      imageSrc: "/e-masjid/login.png",
      heroImage: "/e-masjid/login.png",
      metric1Val: "Instan",
      metric1Text: {
        id: "Pembayaran & Proses Otomatis",
        en: "Automatic Payment Processing"
      },
      metric2Val: "Real-time",
      metric2Text: {
        id: "Verifikasi Status Transaksi",
        en: "Transaction Verification"
      },
      challenge: {
        id: "Menyediakan alur checkout top-up produk game yang cepat, aman, dan dapat secara otomatis memverifikasi status pembayaran dari payment gateway eksternal secara real-time.",
        en: "Providing a game product top-up checkout flow that is fast, secure, and capable of automatically verifying payment status from external payment gateways in real-time."
      },
      process: {
        id: "Membangun frontend dinamis dengan React dan TypeScript, mengintegrasikan sistem backend Express.js untuk pemrosesan order, dan merancang RESTful APIs dengan callback status pembayaran terenkripsi.",
        en: "Building a dynamic React frontend with TypeScript, integrating an Express.js backend system for order processing, and designing RESTful APIs with encrypted payment callback endpoints."
      },
      outcome: {
        id: "Pengguna dapat melakukan transaksi pengisian ulang game secara mandiri dengan verifikasi otomatis yang memakan waktu kurang dari 30 detik.",
        en: "Users can perform game top-up transactions autonomously with automatic checkouts completed in less than 30 seconds."
      },
      gallery: ["/e-masjid/dashboard.png", "/e-masjid/monitor.png", "/e-masjid/laporan-keuangan.png"]
    },
    {
      id: 3,
      title: {
        id: "Manajemen Kos - Aplikasi Android untuk Pemesanan & Pengelolaan Kamar Kost",
        en: "Boarding House Management - Android Application for Booking & Room Management"
      },
      year: 2023,
      tags: "Mobile Application, Room Booking & Management",
      githubLink: "https://github.com/rizkiadp/Manajemen-Kos-Mobile-App",
      role: "Mobile App Developer",
      stack: "Flutter, Dart, Firebase",
      imageSrc: "/kolnut/web-login.png",
      heroImage: "/kolnut/web-login.png",
      metric1Val: "Multi",
      metric1Text: {
        id: "Peran Akses (Admin & Penyewa)",
        en: "Access Roles (Admin & Tenant)"
      },
      metric2Val: "Online",
      metric2Text: {
        id: "Manajemen Reservasi Kost",
        en: "Reservation Room Management"
      },
      challenge: {
        id: "Membuat aplikasi mobile yang memudahkan penghuni kos memantau kamar kosong, membayar tagihan bulanan, dan memberikan notifikasi tagihan serta status pemesanan secara otomatis.",
        en: "Building a mobile application that allows boarding house seekers to monitor vacant rooms, process payments, and receive automated billing and reservation status notifications."
      },
      process: {
        id: "Mengembangkan aplikasi mobile Android menggunakan framework Flutter, menerapkan arsitektur state management yang rapi, dan menggunakan Firebase Realtime Database untuk sinkronisasi data yang cepat.",
        en: "Developing the Android mobile application with the Flutter framework, applying clean state management architecture, and utilizing Firebase Realtime Database for fast data synchronization."
      },
      outcome: {
        id: "Aplikasi berhasil mempermudah pemilik kos mengelola transaksi bulanan kamar dan menyajikan inventori kamar kos secara real-time kepada calon penyewa.",
        en: "The application successfully simplifies room reservation workflows and delivers a real-time room inventory catalog to potential tenants."
      },
      gallery: ["/kolnut/mobile-home.jpg", "/kolnut/dashboard.png", "/kolnut/resep.png"]
    },
    {
      id: 4,
      title: {
        id: "Automated Marketing Pipeline - Pipeline Data Analitik dengan LLM",
        en: "Automated Marketing Analytics Pipeline - LLM Driven Data Analytics Pipeline"
      },
      year: 2024,
      tags: "AI, LLM, Data Analytics, Python",
      githubLink: "https://github.com/rizkiadp/Automated-Marketing-Analytics-Pipeline-Using-LLM",
      role: "AI & Software Engineer",
      stack: "Python, OpenAI API, LangChain, Pandas",
      imageSrc: "/peminjaman-laravel/login.png",
      heroImage: "/peminjaman-laravel/login.png",
      metric1Val: "LLM",
      metric1Text: {
        id: "Analisis Wawasan Otomatis",
        en: "Automated Insights Generation"
      },
      metric2Val: "100%",
      metric2Text: {
        id: "Otomasi Alur Pipeline Data",
        en: "Pipeline Data Automation"
      },
      challenge: {
        id: "Menyaring ribuan data laporan pemasaran mentah dan mengekstrak laporan ringkasan wawasan (insights) yang bernilai bisnis tinggi tanpa intervensi manual tim analis data.",
        en: "Filtering thousands of raw marketing report rows and extracting high-value summary insights without manual intervention from data analysts."
      },
      process: {
        id: "Membangun alur pemrosesan data otomatis menggunakan Python dan Pandas, merancang prompt engineering modular dengan LangChain, dan memanfaatkan model GPT OpenAI untuk memproses hasil wawasan.",
        en: "Constructing automated processing pipelines with Python and Pandas, designing modular prompts with LangChain, and leveraging OpenAI GPT models to extract structured business summaries."
      },
      outcome: {
        id: "Pipeline berhasil mengotomatisasi 100% proses ekstraksi wawasan pemasaran dan mempercepat pembuatan laporan strategis bagi pemangku kepentingan.",
        en: "The pipeline successfully automates 100% of the marketing analysis workflow, expediting strategic reporting cycles for stakeholders."
      },
      gallery: ["/peminjaman-laravel/superadmin-dashboard.png", "/peminjaman-laravel/superadmin-buat-admin.png"]
    },
    {
      id: 5,
      title: {
        id: "Library E-App - Aplikasi Perpustakaan Digital dengan Rekomendasi Buku AI",
        en: "Library E-App - Digital Library Application with AI Book Recommendation"
      },
      year: 2023,
      tags: "Web Application, Machine Learning, Recommendation Engine",
      githubLink: "https://github.com/rizkiadp/Library-E-App-With-Ai-Recomendation-Book",
      role: "Fullstack Developer & ML Engineer",
      stack: "Node.js, Express, EJS, Machine Learning",
      imageSrc: "/mini-sosmed/login.png",
      heroImage: "/mini-sosmed/login.png",
      metric1Val: "AI",
      metric1Text: {
        id: "Sistem Rekomendasi Buku",
        en: "Book Recommendation Engine"
      },
      metric2Val: "Responsif",
      metric2Text: {
        id: "Desain UI/UX & Interaksi",
        en: "UI/UX Layout Design"
      },
      challenge: {
        id: "Membangun katalog perpustakaan digital interaktif dengan sistem rekomendasi buku cerdas berbasis minat pembaca untuk meningkatkan retensi membaca buku.",
        en: "Constructing an interactive digital library catalog integrated with an intelligent recommendation engine based on user interests to improve reading retention."
      },
      process: {
        id: "Merancang UI web menggunakan template engine EJS, membangun REST API penanganan buku dengan Express.js, dan melatih model pembelajaran mesin sederhana untuk menganalisis preferensi bacaan pengguna.",
        en: "Designing the UI using EJS template engine, building books management REST APIs with Express.js, and training a machine learning model to analyze user reading preferences."
      },
      outcome: {
        id: "Perpustakaan digital yang cepat, responsif, dan mampu menyajikan daftar buku personalisasi yang relevan berdasarkan riwayat pencarian pembaca.",
        en: "A fast, responsive digital library system capable of presenting personalized reading suggestions based on users' search history."
      },
      gallery: ["/mini-sosmed/register.png", "/mini-sosmed/beranda-fesnuk.png", "/mini-sosmed/modal-buka-komentar.png"]
    },
    {
      id: 6,
      title: {
        id: "Sistem Akuntansi Internal & Penilaian Pendapatan - CV SIC Yogyakarta",
        en: "Internal Accounting & Revenue Assessment System - CV SIC Yogyakarta"
      },
      year: 2024,
      tags: "Web Application, Corporate Finance, ERP",
      githubLink: "#",
      role: "Programmer (Intern)",
      stack: "HTML, CSS, JavaScript, MySQL, PHP",
      imageSrc: "/accounting-system/gambar10.png",
      heroImage: "/accounting-system/gambar10.png",
      metric1Val: "60%",
      metric1Text: {
        id: "Efisiensi Waktu Operasional",
        en: "Operational Time Saved"
      },
      metric2Val: "Aman",
      metric2Text: {
        id: "Manajemen Akses Multi-Level",
        en: "Role-Based Access Control"
      },
      challenge: {
        id: "Mengganti proses pencatatan pembukuan keuangan manual perusahaan yang rentan kesalahan ke dalam sistem digital terpusat yang aman dengan hak akses yang teratur.",
        en: "Replacing manual bookkeeping processes that are prone to human errors with a secure, centralized digital database under structured user access permissions."
      },
      process: {
        id: "Merancang skema database relasional MySQL, mengimplementasikan antarmuka website keuangan menggunakan HTML, CSS, JavaScript, serta mengelola validasi input data kas masuk dan keluar.",
        en: "Designing MySQL relational database schemas, implementing financial website UI components with HTML/CSS/JS, and managing input validation for revenue logging."
      },
      outcome: {
        id: "Sistem berhasil memangkas waktu rekonsiliasi laporan keuangan bulanan hingga 60% serta menjamin data keuangan perusahaan tersimpan secara terstruktur.",
        en: "The system successfully reduced financial reconciliation cycles by 60% while ensuring company ledger data is structured securely."
      },
      gallery: ["/accounting-system/gambar9.png", "/accounting-system/gambar1.png", "/accounting-system/gambar6.png"]
    }
  ];

  // Render Projects cards with Pagination
  const projectCardsContainer = document.getElementById("project-cards-container");
  const paginationContainer = document.getElementById("project-pagination");
  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;

  function renderCards(page) {
    if (!projectCardsContainer) return;
    projectCardsContainer.innerHTML = "";
    const start = (page - 1) * ITEMS_PER_PAGE;
    const pageProjects = projects.slice(start, start + ITEMS_PER_PAGE);

    pageProjects.forEach((proj) => {
      const titleText = proj.title[locale];
      const displayTitle = titleText.split(" - ")[0];
      const [c1, c2] = getGradient(proj.stack, proj.tags);
      const icon = getLangIcon(proj.stack, proj.tags);
      const stackArr = proj.stack.split(", ");
      const visibleTags = stackArr.slice(0, 4)
        .map(t => `<span class="porto-tag">${t}</span>`).join("");
      const extra = stackArr.length > 4
        ? `<span class="porto-tag">+${stackArr.length - 4}</span>` : "";
      const repoName = proj.githubLink === "#"
        ? "PRIVATE" : proj.githubLink.split("/").pop();

      const card = document.createElement("div");
      card.className = "porto-card";
      card.innerHTML = `
        <div class="porto-card-header" style="background:linear-gradient(135deg,${c1}28,${c2}50);border-bottom:1px solid ${c1}28;">
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 25% 55%,${c1}20,transparent 65%);"></div>
          <span class="porto-card-icon">${icon}</span>
          <span class="porto-card-year">${proj.year}</span>
          <div class="porto-card-lang">
            <span class="porto-card-lang-dot" style="background:${c1};"></span>
            <span class="porto-card-lang-name">${stackArr[0]}</span>
          </div>
        </div>
        <div class="porto-card-body">
          <div style="display:flex;flex-direction:column;gap:8px;">
            <h3 class="porto-card-title">${displayTitle}</h3>
            <span class="porto-card-role">${proj.role}</span>
            <p class="porto-card-desc">${proj.challenge[locale]}</p>
          </div>
          <div class="porto-card-tags">${visibleTags}${extra}</div>
          <div class="porto-card-footer">
            <span class="porto-card-id">ID: ${repoName}</span>
            <a href="${proj.githubLink}" target="_blank" rel="noopener"
               onclick="event.stopPropagation()"
               class="porto-gh-btn"
               ${proj.githubLink === "#" ? 'style="pointer-events:none;opacity:0.3;"' : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style="width:12px;height:12px;flex-shrink:0;"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
          </div>
        </div>
      `;
      card.addEventListener("click", () => openProjectModal(proj));
      projectCardsContainer.appendChild(card);
    });

    // Pagination
    if (paginationContainer) {
      const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
      paginationContainer.innerHTML = "";
      if (totalPages <= 1) return;

      const mkBtn = (label, onClick, active, disabled) => {
        const btn = document.createElement("button");
        btn.innerHTML = label;
        btn.className = "pg-btn" + (active ? " active" : "");
        btn.disabled = !!disabled;
        if (!disabled) btn.addEventListener("click", onClick);
        return btn;
      };

      paginationContainer.appendChild(mkBtn(
        isEn ? "← Prev" : "← Sebelum", () => { currentPage--; renderCards(currentPage); },
        false, currentPage === 1
      ));
      for (let i = 1; i <= totalPages; i++) {
        const p = i;
        paginationContainer.appendChild(mkBtn(String(p), () => {
          currentPage = p; renderCards(currentPage);
          document.getElementById("project").scrollIntoView({ behavior: "smooth", block: "start" });
        }, p === currentPage));
      }
      paginationContainer.appendChild(mkBtn(
        isEn ? "Next →" : "Berikut →", () => { currentPage++; renderCards(currentPage); },
        false, currentPage === totalPages
      ));
    }
  }

  renderCards(currentPage);


  // Modal handlers
  const modal = document.getElementById("project-modal");
  const modalCloseBtn = document.getElementById("modal-close");
  const modalBgClose = document.getElementById("modal-bg-close");

  function openProjectModal(proj) {
    if (!modal) return;
    const [c1, c2] = getGradient(proj.stack, proj.tags);
    const icon = getLangIcon(proj.stack, proj.tags);

    // Gradient banner
    const heroBanner = document.getElementById("modal-hero-banner");
    if (heroBanner) {
      heroBanner.style.background = `linear-gradient(135deg, ${c1}22 0%, ${c2}55 100%)`;
      heroBanner.style.borderBottom = `1px solid ${c1}30`;
      document.getElementById("modal-hero-icon").textContent = icon;
    }

    document.getElementById("modal-title").textContent = proj.title[locale];
    document.getElementById("modal-tags").textContent = proj.tags;
    document.getElementById("modal-metric1-val").textContent = proj.metric1Val;
    document.getElementById("modal-metric1-text").textContent = proj.metric1Text[locale];
    document.getElementById("modal-metric2-val").textContent = proj.metric2Val;
    document.getElementById("modal-metric2-text").textContent = proj.metric2Text[locale];
    document.getElementById("modal-role").textContent = proj.role;
    document.getElementById("modal-stack").innerHTML = proj.stack.split(", ")
      .map(t => `<span class="inline-block bg-white/5 border border-white/10 text-white/60 text-xs font-mono rounded-full px-3 py-1 mr-1.5 mb-1.5">${t}</span>`)
      .join("");
    document.getElementById("modal-challenge").textContent = proj.challenge[locale];
    document.getElementById("modal-process").textContent = proj.process[locale];
    document.getElementById("modal-outcome").textContent = proj.outcome[locale];

    const ghLink = document.getElementById("modal-github");
    if (proj.githubLink === "#") {
      ghLink.textContent = isEn ? "Not Available (Confidential)" : "Tidak Tersedia (Rahasia)";
      ghLink.href = "#";
      ghLink.style.pointerEvents = "none";
      ghLink.style.opacity = "0.4";
    } else {
      ghLink.textContent = isEn ? "Open in GitHub →" : "Buka di GitHub →";
      ghLink.href = proj.githubLink;
      ghLink.style.pointerEvents = "auto";
      ghLink.style.opacity = "1";
    }

    modal.classList.remove("invisible");
    document.body.style.overflow = "hidden";
    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    const modalBox = modal.querySelector(".modal-box");
    if (modalBox) gsap.fromTo(modalBox, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
  }

  function closeProjectModal() {
    if (!modal) return;
    document.body.style.overflow = "";
    gsap.to(modal, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        modal.classList.add("invisible");
      }
    });
  }

  if (modalCloseBtn && modalBgClose) {
    modalCloseBtn.addEventListener("click", closeProjectModal);
    modalBgClose.addEventListener("click", closeProjectModal);
  }

  // Esc key closes modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.classList.contains("invisible")) {
      closeProjectModal();
    }
  });

  // 7. Update Clock Time (Jakarta/WIB timezone)
  const clockElement = document.getElementById("footer-clock");
  function updateClock() {
    if (!clockElement) return;
    const timeOptions = {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const timeString = new Intl.DateTimeFormat("en-US", timeOptions).format(new Date());
    clockElement.textContent = `${timeString} WIB`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // 8. Custom GSAP Scroll Trigger Animations
  function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // ── HERO ─────────────────────────────────────────────
    gsap.fromTo("#home h1", 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power4.out", delay: 0.15 }
    );
    gsap.fromTo("#home p", 
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out", delay: 0.45 }
    );
    gsap.fromTo("#home a", 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", delay: 0.65 }
    );

    // ── SECTION WRAPPER FADE-IN (Buttery Smooth, no scale/blur/offset lag) ──
    document.querySelectorAll("section").forEach((sec) => {
      if (sec.id === "home") return;
      
      // Gentle opacity fade on scroll
      gsap.fromTo(sec,
        { opacity: 0 },
        {
          scrollTrigger: {
            trigger: sec,
            start: "top 88%",
            once: true,
          },
          opacity: 1,
          duration: 0.8,
          ease: "power2.out"
        }
      );
    });

    // ── Helper: reveal headings per section ─────────────────────────────
    const sections = ["#about", "#stack", "#project", "#experience", "#contact", "#footer"];
    sections.forEach((sel) => {
      const el = document.querySelector(sel);
      if (!el) return;

      // Section label (small caps above heading)
      const label = el.querySelectorAll("p.text-\\[\\#7163F1\\]");
      if (label.length) {
        gsap.fromTo(label,
          { opacity: 0, y: 15 },
          {
            scrollTrigger: { trigger: sel, start: "top 85%", once: true },
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out"
          }
        );
      }

      // Main heading h2 (with smooth slide up and fade)
      const h2 = el.querySelectorAll("h2");
      if (h2.length) {
        gsap.fromTo(h2,
          { opacity: 0, y: 35 },
          {
            scrollTrigger: { trigger: sel, start: "top 82%", once: true },
            opacity: 1, y: 0, duration: 1.0, ease: "power3.out"
          }
        );
      }
    });

    // ── ABOUT ─────────────────────────────────────────────
    const aboutMedia = document.querySelectorAll("#about img, #about video");
    if (aboutMedia.length) {
      gsap.fromTo(aboutMedia,
        { opacity: 0, y: 30 },
        {
          scrollTrigger: { trigger: "#about", start: "top 78%", once: true },
          opacity: 1, y: 0, duration: 1.1, ease: "power3.out"
        }
      );
    }
    
    const aboutCards = document.querySelectorAll("#about .bg-white\\/2, #about [class*='bg-white/2']");
    if (aboutCards.length) {
      gsap.fromTo(aboutCards,
        { opacity: 0, y: 30, scale: 0.97 },
        {
          scrollTrigger: { trigger: "#about", start: "top 74%", once: true },
          opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.85, ease: "power3.out"
        }
      );
    }

    const aboutTexts = document.querySelectorAll("#about p.font-light, #about p.text-white\\/70");
    if (aboutTexts.length) {
      gsap.fromTo(aboutTexts,
        { opacity: 0, y: 20 },
        {
          scrollTrigger: { trigger: "#about", start: "top 76%", once: true },
          opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out"
        }
      );
    }

    // ── TECH STACK ────────────────────────────────────────
    const stackItems = document.querySelectorAll("#stack .grid > div");
    if (stackItems.length) {
      gsap.fromTo(stackItems,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          scrollTrigger: { trigger: "#stack", start: "top 82%", once: true },
          opacity: 1, y: 0, scale: 1,
          stagger: { amount: 0.4, from: "start" },
          duration: 0.8, ease: "power3.out"
        }
      );
    }

    // ── PORTFOLIO / PROJECT ──────────────────────────────
    setTimeout(() => {
      const cards = document.querySelectorAll("#project-cards-container > .porto-card");
      if (cards.length) {
        gsap.fromTo(cards,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            scrollTrigger: { trigger: "#project", start: "top 78%", once: true },
            opacity: 1, y: 0, scale: 1,
            stagger: 0.08, duration: 0.9, ease: "power3.out"
          }
        );
      }
    }, 100);

    gsap.fromTo("#project-pagination",
      { opacity: 0, y: 20 },
      {
        scrollTrigger: { trigger: "#project-pagination", start: "top 92%", once: true },
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out"
      }
    );

    // ── EXPERIENCE ────────────────────────────────────────
    const expItems = document.querySelectorAll("#experience .space-y-12 > div");
    if (expItems.length) {
      expItems.forEach((item, i) => {
        gsap.fromTo(item,
          { opacity: 0, y: 35 },
          {
            scrollTrigger: { trigger: item, start: "top 86%", once: true },
            opacity: 1, y: 0, duration: 1.0, ease: "power3.out"
          }
        );
      });
    }

    // ── CONTACT ───────────────────────────────────────────
    const contactElements = document.querySelectorAll("#contact > div > *");
    if (contactElements.length) {
      gsap.fromTo(contactElements,
        { opacity: 0, y: 35 },
        {
          scrollTrigger: { trigger: "#contact", start: "top 82%", once: true },
          opacity: 1, y: 0, stagger: 0.1, duration: 0.9, ease: "power3.out"
        }
      );
    }

    // ── FOOTER ────────────────────────────────────────────
    const footerElements = document.querySelectorAll("footer > *, footer p, footer a");
    if (footerElements.length) {
      gsap.fromTo(footerElements,
        { opacity: 0, y: 20 },
        {
          scrollTrigger: { trigger: "footer", start: "top 94%", once: true },
          opacity: 1, y: 0, stagger: 0.05, duration: 0.7, ease: "power3.out"
        }
      );
    }
  }
});
