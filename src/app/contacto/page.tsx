import { Suspense } from "react";
import { InteractiveForm } from "@/components/shared/interactive-form";
import styles from "@/styles/form-page.module.css";

export default function ContactoPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div 
          className={styles.heroBg} 
          style={{ backgroundImage: "url('/imagenes/Genericas/eqa (2).webp')" }} 
        />
        <div className={styles.heroCopy}>
          <p className="eyebrow" style={{ color: "var(--color-accent-soft)" }}>Canales Directos</p>
          <h1>Ponte en contacto con nuestro equipo</h1>
          <p>
            Estamos listos para apoyarte a estructurar y automatizar tu plan de certificación e implementación de normas ISO.
          </p>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="shell">
          <div className={styles.splitGrid}>
            
            {/* Columna Izquierda: Información de Contacto integrada en tarjeta */}
            <div className={styles.infoColumn}>
              <div className={styles.infoText}>
                <h3>Asesoría y Soporte Especializado</h3>
                <p>
                  Nuestro equipo de consultores y auditores ISO te guiará durante todo el proceso de diagnóstico y maduración digital con la plataforma TransiQ.
                </p>
              </div>

              {/* Tarjeta de Ubicación con Portada de Auditoría Integrada */}
              <div className={styles.locationCard}>
                <div className={styles.locationCover} />
                <div className={styles.locationBody}>
                  <div className={styles.detailItem}>
                    <div className={styles.iconWrapper}>📍</div>
                    <div className={styles.itemText}>
                      <span className={styles.itemLabel}>Dirección Corporativa</span>
                      <span className={styles.itemVal}>Paseo de la Reforma 222, Colonia Juárez, Delegación Cuauhtémoc, Ciudad de México, CP 06600</span>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <div className={styles.iconWrapper}>📞</div>
                    <div className={styles.itemText}>
                      <span className={styles.itemLabel}>Líneas de Atención</span>
                      <span className={styles.itemVal}>+52 (55) 4123-4567 | +52 (55) 8901-2345</span>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <div className={styles.iconWrapper}>✉️</div>
                    <div className={styles.itemText}>
                      <span className={styles.itemLabel}>Correo Electrónico</span>
                      <span className={styles.itemVal}>contacto@isosolutions.com | soporte@transiq.com</span>
                    </div>
                  </div>

                  <div className={styles.detailItem}>
                    <div className={styles.iconWrapper}>🌐</div>
                    <div className={styles.itemText}>
                      <span className={styles.itemLabel}>Redes Sociales</span>
                      <div className={styles.socials}>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={styles.socialLink}>in</a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className={styles.socialLink}>𝕏</a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.socialLink}>f</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Formulario interactivo */}
            <div className={styles.formContainer}>
              <Suspense fallback={
                <div className="cardSurface" style={{ padding: 40, display: "grid", placeItems: "center" }}>
                  <p className="eyebrow">Cargando formulario...</p>
                </div>
              }>
                <InteractiveForm source="Formulario de contacto" defaultInterest="Certificación" />
              </Suspense>
            </div>
            
          </div>
        </div>

        {/* Sección Inferior del Mapa: A todo el ancho y pegada al footer */}
        <div className={styles.fullWidthMap}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.539591461947!2d-99.1675846850933!3d19.427024486888496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff35f5bd156d%3A0x6b44ab4f5cfd71c4!2sPaseo%20de%20la%20Reforma%2C%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1659900000000!5m2!1ses!2smx"
            width="100%" 
            height="100%" 
            style={{ border: 0, display: "block" }} 
            allowFullScreen={true} 
            loading="lazy"
            title="Mapa de oficinas TransiQ"
          />
        </div>
      </section>
    </main>
  );
}
