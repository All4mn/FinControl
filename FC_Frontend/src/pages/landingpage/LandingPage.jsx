import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";

const Icons = {
  PiggyBank: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
      <path d="M2 9v1c0 1.1.9 2 2 2h1" />
      <path d="M16 11h.01" />
    </svg>
  ),
  Menu: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  ),
  X: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  CheckCircle: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
  BarChart3: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
  PieChart: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  ),
  Calendar: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  Shield: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Smartphone: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  ),
  Users: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Code2: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 16 4-4-4-4" />
      <path d="m6 8-4 4 4 4" />
      <path d="m14.5 4-5 16" />
    </svg>
  ),
  Target: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Heart: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  Gift: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect width="20" height="5" x="2" y="7" />
      <line x1="12" x2="12" y1="22" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  ),
  Mail: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Phone: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Instagram: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
};

const features = [
  {
    icon: Icons.BarChart3,
    title: "Relatórios Mensais",
    description:
      "Visualize seu desempenho financeiro mês a mês com gráficos coloridos e fáceis de entender.",
  },
  {
    icon: Icons.PieChart,
    title: "Categorias de Gastos",
    description:
      "Organize suas despesas por categorias como Alimentação, Transporte, Lazer e muito mais.",
  },
  {
    icon: Icons.Calendar,
    title: "Histórico Completo",
    description:
      "Acompanhe todas as suas transações com datas, valores e descrições detalhadas.",
  },
  {
    icon: Icons.Shield,
    title: "Segurança de Dados",
    description:
      "Seus dados financeiros são protegidos com criptografia e login seguro.",
  },
  {
    icon: Icons.Smartphone,
    title: "Acesse de Qualquer Lugar",
    description:
      "Use no computador, tablet ou celular. Seus dados sempre sincronizados.",
  },
  {
    icon: Icons.Users,
    title: "Compartilhe Contas",
    description:
      "Compartilhe o controle financeiro com familiares ou parceiros de forma prática.",
  },
];

const steps = [
  {
    number: "01",
    title: "Crie sua conta",
    description:
      "Cadastre-se gratuitamente em poucos segundos usando seu e-mail ou Google.",
  },
  {
    number: "02",
    title: "Adicione suas transações",
    description:
      "Registre suas receitas e despesas de forma simples, escolhendo categoria e método de pagamento.",
  },
  {
    number: "03",
    title: "Acompanhe seus relatórios",
    description:
      "Visualize gráficos e relatórios mensais para entender para onde seu dinheiro está indo.",
  },
];

const includedFeatures = [
  "Registro ilimitado de transações",
  "Relatórios mensais e anuais",
  "Gráficos de gastos por categoria",
  "Múltiplas contas bancárias",
  "Compartilhamento de contas",
  "Acesso em todos os dispositivos",
  "Backup automático dos dados",
  "Suporte por e-mail",
];

export function LandingPage({ aoClicarEntrar }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const irParaLogin = () => {
    navigate("/login");
  };

  const irParaCadastro = () => {
    navigate("/cadastro");
  };

  return (
    <div className={styles.landingPage}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <a href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Icons.PiggyBank />
            </div>
            <span className={styles.logoText}>FinControl</span>
          </a>

          <nav className={styles.nav}>
            <a href="#recursos" className={styles.navLink}>
              Recursos
            </a>
            <a href="#como-funciona" className={styles.navLink}>
              Como Funciona
            </a>
            <a href="#sobre" className={styles.navLink}>
              Sobre
            </a>
            <a href="#preco" className={styles.navLink}>
              Preço
            </a>
          </nav>

          <div className={styles.headerButtons}>
            <button
              className={`${styles.button} ${styles.buttonGhost}`}
              onClick={irParaLogin}
            >
              Entrar
            </button>
            <button
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={irParaCadastro}
            >
              Cadastre-se
            </button>
          </div>

          <button
            className={styles.menuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNav}>
              <a
                href="#recursos"
                className={styles.navLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Recursos
              </a>
              <a
                href="#como-funciona"
                className={styles.navLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Como Funciona
              </a>
              <a
                href="#sobre"
                className={styles.navLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre
              </a>
              <a
                href="#preco"
                className={styles.navLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Preço
              </a>
              <div className={styles.mobileButtons}>
                <button
                  className={`${styles.button} ${styles.buttonGhost} ${styles.buttonFullWidth}`}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    irParaLogin();
                  }}
                >
                  Entrar
                </button>
                <button
                  className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonFullWidth}`}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    irParaCadastro();
                  }}
                >
                  Cadastre-se
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroDecoration1} />
        <div className={styles.heroDecoration2} />

        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.badge}>
                <Icons.CheckCircle />
                100% Gratuito
              </div>

              <h1 className={styles.heroTitle}>
                Controle suas finanças de forma{" "}
                <span className={styles.highlight}>simples e inteligente</span>
              </h1>

              <p className={styles.heroDescription}>
                O FinControl ajuda você a organizar suas receitas e despesas,
                visualizar relatórios mensais e tomar decisões financeiras mais
                conscientes. Feito para pessoas de todas as idades.
              </p>

              <div className={styles.heroButtons}>
                <button
                  className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonLarge}`}
                  onClick={irParaCadastro}
                >
                  Começar Agora
                  <Icons.ArrowRight />
                </button>
                <button
                  className={`${styles.button} ${styles.buttonOutline} ${styles.buttonLarge}`}
                >
                  Veja Como Funciona
                </button>
              </div>

              <div className={styles.heroFeatures}>
                <div className={styles.heroFeature}>
                  <Icons.CheckCircle />
                  Sem taxas ocultas
                </div>
                <div className={styles.heroFeature}>
                  <Icons.CheckCircle />
                  Fácil de usar
                </div>
                <div className={styles.heroFeature}>
                  <Icons.CheckCircle />
                  Dados protegidos
                </div>
              </div>
            </div>

            <div className={styles.heroImageWrapper}>
              <div className={styles.heroImage}>
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7latNSJPFlmUYFsye6eF9upZ3BisJb.png"
                  alt="Dashboard do FinControl mostrando saldo e transações"
                />
              </div>
              <div className={styles.floatingCard}>
                <div className={styles.floatingCardContent}>
                  <div className={styles.floatingCardIcon}>
                    <Icons.CheckCircle />
                  </div>
                  <div>
                    <p className={styles.floatingCardTitle}>Saldo positivo!</p>
                    <p className={styles.floatingCardSubtitle}>
                      +R$500,00 este mês
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="recursos" className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Tudo o que você precisa para{" "}
              <span className={styles.highlight}>organizar suas finanças</span>
            </h2>
            <p className={styles.sectionDescription}>
              Ferramentas simples e poderosas para ajudar você a ter controle
              total do seu dinheiro.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <feature.icon />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className={styles.howItWorks}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Como o <span className={styles.highlight}>FinControl</span>{" "}
              funciona?
            </h2>
            <p className={styles.sectionDescription}>
              Três passos simples para você começar a controlar suas finanças
              hoje mesmo.
            </p>
          </div>

          <div className={styles.howItWorksGrid}>
            <div className={styles.steps}>
              {steps.map((step, index) => (
                <div key={index} className={styles.step}>
                  <div className={styles.stepNumber}>{step.number}</div>
                  <div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.screenshots}>
              <div className={styles.screenshot}>
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JLMCwVu9drylKXMqnWBbbL8cpnksbM.png"
                  alt="Relatório mensal do FinControl"
                />
              </div>
              <div className={styles.screenshot}>
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Pm3tjiLKcBv992LSrQAz4qSz5Ly8vW.png"
                  alt="Gráficos de gastos por categoria"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="sobre" className={styles.about}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Sobre o <span className={styles.highlight}>FinControl</span>
            </h2>
            <p className={styles.sectionDescription}>
              Conheça a história por trás do projeto e quem está desenvolvendo
              esta ferramenta.
            </p>
          </div>

          <div className={styles.aboutContent}>
            <div className={styles.creatorCard}>
              <div className={styles.creatorContent}>
                <div className={styles.creatorIcon}>
                  <Icons.Code2 />
                </div>
                <div className={styles.creatorText}>
                  <h3 className={styles.creatorTitle}>Criado por Estudantes</h3>
                  <p className={styles.creatorDescription}>
                    O FinControl é um projeto desenvolvido com o objetivo de
                    ajudar pessoas a terem mais controle sobre suas finanças
                    pessoais. Nasceu da necessidade de uma ferramenta simples e
                    acessível que qualquer pessoa pudesse usar, independente da
                    idade ou conhecimento técnico.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.valuesGrid}>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <Icons.Target />
                </div>
                <h3 className={styles.valueTitle}>Nossa Missão</h3>
                <p className={styles.valueDescription}>
                  Democratizar o acesso a ferramentas de controle financeiro,
                  permitindo que qualquer pessoa possa organizar suas finanças
                  de forma simples e gratuita.
                </p>
              </div>

              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <Icons.Heart />
                </div>
                <h3 className={styles.valueTitle}>Nossos Valores</h3>
                <p className={styles.valueDescription}>
                  Acreditamos na simplicidade, acessibilidade e transparência. O
                  FinControl foi pensado para ser intuitivo para todas as
                  idades, desde jovens até idosos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="preco" className={styles.pricing}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Quanto custa o <span className={styles.highlight}>FinControl</span>?
            </h2>
            <p className={styles.sectionDescription}>
              Boas notícias: o FinControl é completamente gratuito! Acreditamos
              que todos merecem ter controle sobre suas finanças.
            </p>
          </div>

          <div className={styles.pricingCard}>
            <div className={styles.pricingBadge}>
              <Icons.Gift />
              Gratuito para sempre
            </div>

            <div className={styles.pricingHeader}>
              <div className={styles.priceValue}>
                <span className={styles.priceAmount}>R$0</span>
                <span className={styles.pricePeriod}>/mês</span>
              </div>
              <p className={styles.priceSubtext}>
                Sem taxas ocultas, sem período de teste
              </p>
            </div>

            <div className={styles.pricingContent}>
              <ul className={styles.featuresList}>
                {includedFeatures.map((feature, index) => (
                  <li key={index} className={styles.featureItem}>
                    <Icons.CheckCircle />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonLarge} ${styles.pricingButton}`}
                onClick={irParaCadastro}
              >
                Criar Conta Gratuita
              </button>
            </div>
          </div>

          <div className={styles.trustSection}>
            <p className={styles.trustTitle}>Por que é gratuito?</p>
            <p className={styles.trustDescription}>
              O FinControl foi criado como um projeto para ajudar pessoas a
              terem mais controle sobre suas finanças pessoais. Nosso objetivo é
              democratizar o acesso a ferramentas de gestão financeira.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <div className={styles.ctaIcon}>
              <Icons.PiggyBank />
            </div>

            <h2 className={styles.ctaTitle}>
              Comece a controlar suas finanças hoje!
            </h2>

            <p className={styles.ctaDescription}>
              Junte-se a milhares de pessoas que já estão usando o FinControl
              para organizar suas finanças. Cadastro rápido e totalmente
              gratuito.
            </p>

            <div className={styles.ctaButtons}>
              <button
                className={`${styles.button} ${styles.buttonSecondary} ${styles.buttonLarge}`}
                onClick={irParaCadastro}
              >
                Criar Conta Grátis
                <Icons.ArrowRight />
              </button>
              <button
                className={`${styles.button} ${styles.buttonOutlineLight} ${styles.buttonLarge}`}
              >
                Saiba Mais
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <a href="/" className={styles.footerLogo}>
                <div className={styles.footerLogoIcon}>
                  <Icons.PiggyBank />
                </div>
                <span className={styles.footerLogoText}>FinControl</span>
              </a>
              <p className={styles.footerDescription}>
                O FinControl é uma ferramenta gratuita de controle financeiro
                pessoal, criada para ajudar pessoas de todas as idades a
                organizarem suas finanças.
              </p>
            </div>

            <div className={styles.footerSection}>
              <h3>Links</h3>
              <ul className={styles.footerLinks}>
                <li>
                  <a href="#recursos">Recursos</a>
                </li>
                <li>
                  <a href="#como-funciona">Como Funciona</a>
                </li>
                <li>
                  <a href="#sobre">Sobre</a>
                </li>
                <li>
                  <a href="#preco">Preço</a>
                </li>
              </ul>
            </div>

            <div className={styles.footerSection}>
              <h3>Contato</h3>
              <ul className={styles.contactList}>
                <li>
                  <a href="tel:+5544900000000" className={styles.contactItem}>
                    <Icons.Phone />
                    (44) 9 0000-0000
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:fincontrol.contato@gmail.com"
                    className={styles.contactItem}
                  >
                    <Icons.Mail />
                    fincontrol.contato@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/FinControlLTDA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactItem}
                  >
                    <Icons.Instagram />
                    @FinControlLTDA
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>
              &copy; {new Date().getFullYear()} FinControl. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;