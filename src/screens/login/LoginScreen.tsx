import { useState, useEffect } from 'react';
import LoginForm from '../../components/LoginForm';
import RegisterForm from '../../components/RegisterForm';
import styles from '../../components/BookLogin.module.css';
import lottie from 'lottie-web';
import animationData from '../../assets/animations/stars.json';
import fundoazul from '../../assets/img/fundoazul.jpeg';

export default function LoginScreen() {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const container = document.querySelector(`.${styles.lottieBackground}`);
    if (container) {
      const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData,
      });

      return () => anim.destroy();
    }
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${fundoazul})`,
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '2000px',
        overflow: 'hidden',
      }}
    >
      {/* Contêiner da animação Lottie */}
      <div className={styles.lottieBackground}></div>
      <div
        className={
          aberto
            ? `${styles.livroContainer} ${styles.livroContainerAberto}`
            : styles.livroContainer
        }
      >
        {/* Capa do livro */}
        <div className={styles.capaLivro}>
          <div
            className={
              aberto
                ? `${styles.capaFrente} ${styles.capaFrenteAberta}`
                : styles.capaFrente
            }
          >
            <h1 className={styles.capaFrenteTitulo}>Letrário</h1>
            <button
              className={styles.abrirLivroBtn}
              onClick={() => setAberto(true)}
            >
              Faça login ou cadastre-se
            </button>
          </div>
          <div className={styles.capaTras}></div>
        </div>
        {/* Livro aberto */}
        {aberto && (
          <div className={styles.livroAberto}>
            <div className={styles.paginaEsquerda}>
              <div className={styles.paginaOrnamento}></div>
              <div className={styles.loginForm}>
                <LoginForm
                  onFlip={() => setAberto(false)}
                  customStyle={styles}
                />
              </div>
              <div className={styles.numeroPagina}>1</div>
            </div>
            <div className={styles.paginaDireita}>
              <div className={styles.paginaOrnamento}></div>
              <div className={styles.cadastroForm}>
                <RegisterForm
                  onFlip={() => setAberto(false)}
                  customStyle={styles}
                />
              </div>
              <div className={styles.numeroPagina}>2</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
