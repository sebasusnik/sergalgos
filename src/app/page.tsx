import Link from 'next/link'
import { FamilyStories } from './components/family-stories'

export default function Home(): React.ReactElement {
  return (
    <div className="bg-background font-sans pb-20 md:pb-0">
      <div className="max-w-5xl mx-auto">
        <main>
          {/* Hero Section */}
          <section id="inicio" className="scroll-mt-20 relative overflow-hidden">
            <div className="px-4">
              <div className="relative flex flex-col justify-center min-h-[400px] md:flex-row md:items-center md:min-h-0">
                {/* Text Content */}
                <div className="flex flex-col justify-center md:gap-4 w-full md:w-1/2 py-4 relative z-10 md:order-1">
                  <div>
                    <h1 className="font-serif font-semibold text-[clamp(40px,8vw,60px)] leading-tight">
                      <span className="text-text-heading">
                        ¿Querés
                        <br />
                        adoptar un
                        <br />
                      </span>
                      <span className="text-primary">galgo?</span>
                    </h1>
                  </div>
                  <div className="mt-1 max-w-[350px]">
                    <p className="font-sans font-normal text-text-body text-base leading-6">
                      Te ayudamos a encontrar el compañero perfecto y a transformar su vida para
                      siempre.
                    </p>
                  </div>
                  <div className="mt-3">
                    <Link
                      href="/adoptar"
                      className="inline-flex items-center justify-center bg-primary text-text-on-primary font-bold py-2 px-6 rounded-full hover:bg-primary-hover transition-colors cursor-pointer"
                    >
                      Llená el formulario
                    </Link>
                  </div>
                </div>

                {/* Image Container for Desktop */}
                <div className="hidden md:block md:w-1/2 md:order-2">
                  <img
                    src="/galgo-hero.png"
                    alt="Ilustración de un galgo"
                    className="w-full h-auto max-h-[550px] object-contain object-left"
                  />
                </div>
              </div>
            </div>
            {/* Image for Mobile (absolute, overflows) */}
            <div className="absolute top-0 right-0 w-3/5 h-full z-0 md:hidden">
              <img
                src="/galgo-hero.png"
                alt="Ilustración de un galgo"
                className="absolute right-[-110px] sm:right-[20px] top-1/2 -translate-y-[148px] h-[100%] sm:-translate-y-[180px] w-auto max-w-none transition-all duration-300"
              />
            </div>
          </section>

          {/* About Us Section */}
          <section id="nosotros" className="px-4 py-8 md:py-12 scroll-mt-20">
            <div>
              <h2 className="font-sans font-bold text-text-heading text-2xl leading-7">
                Somos Ser Galgos
              </h2>
              <p className="mt-4 font-sans font-normal text-text-heading text-base leading-6">
                Somos una organización sin fines de lucro dedicada a rescatar y reubicar galgos.
                Nuestra misión es encontrar hogares amorosos para estos gigantes gentiles,
                asegurando que vivan vidas felices y plenas.
              </p>
            </div>
          </section>

          {/* Features Section */}
          <section className="p-4 md:py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-4 w-full bg-surface rounded-lg border border-border">
                <img
                  src="https://c.animaapp.com/md6hg0hm7ohV8F/img/vector---0-1.svg"
                  className="w-6 h-6"
                  alt="Icono de Refugio"
                />
                <span className="font-sans font-bold text-text-heading text-base leading-5">
                  Refugio Seguro
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 w-full bg-surface rounded-lg border border-border">
                <img
                  src="https://c.animaapp.com/md6hg0hm7ohV8F/img/vector---0-3.svg"
                  className="w-6 h-6"
                  alt="Icono de Cuidado"
                />
                <span className="font-sans font-bold text-text-heading text-base leading-5">
                  Cuidado Compasivo
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 w-full bg-surface rounded-lg border border-border">
                <img
                  src="https://c.animaapp.com/md6hg0hm7ohV8F/img/vector---0-4.svg"
                  className="w-6 h-6"
                  alt="Icono de Comunidad"
                />
                <span className="font-sans font-bold text-text-heading text-base leading-5">
                  Apoyo de la Comunidad
                </span>
              </div>
            </div>
          </section>

          {/* Adoption Process Section */}
          <section id="proceso" className="px-4 py-8 md:py-12 scroll-mt-20">
            <div>
              <h2 className="font-sans font-bold text-text-heading text-2xl leading-7 mb-6">
                El Proceso de Adopción
              </h2>
              <div className="flex flex-col">
                <div className="flex items-start gap-2">
                  <img
                    className="w-10 h-auto flex-shrink-0"
                    src="https://c.animaapp.com/md6hg0hm7ohV8F/img/depth-4--frame-0-3.svg"
                    alt="Icono de Contacto"
                  />
                  <div>
                    <h3 className="font-sans font-medium text-text-heading text-base leading-6">
                      Contactanos
                    </h3>
                    <p className="font-sans font-normal text-text-muted text-base leading-6">
                      Contactanos para comenzar tu viaje de adopción.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    className="w-10 h-auto flex-shrink-0"
                    src="https://c.animaapp.com/md6hg0hm7ohV8F/img/depth-4--frame-0.svg"
                    alt="Icono de Conversación"
                  />
                  <div>
                    <h3 className="font-sans font-medium text-text-heading text-base leading-6">
                      Charla y entendimiento mutuo
                    </h3>
                    <p className="font-sans font-normal text-text-muted text-base leading-6">
                      Discutiremos tu estilo de vida y preferencias.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    className="w-10 h-auto flex-shrink-0"
                    src="https://c.animaapp.com/md6hg0hm7ohV8F/img/depth-4--frame-0-2.svg"
                    alt="Icono de Encuentro"
                  />
                  <div>
                    <h3 className="font-sans font-medium text-text-heading text-base leading-6">
                      Encuentro con un galgo
                    </h3>
                    <p className="font-sans font-normal text-text-muted text-base leading-6">
                      Conocé posibles compañeros y encontrá tu pareja perfecta.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    className="w-10 h-auto flex-shrink-0"
                    src="https://c.animaapp.com/md6hg0hm7ohV8F/img/depth-4--frame-0-1.svg"
                    alt="Icono de Prueba"
                  />
                  <div>
                    <h3 className="font-sans font-medium text-text-heading text-base leading-6">
                      Período de prueba
                    </h3>
                    <p className="font-sans font-normal text-text-muted text-base leading-6">
                      Pasá tiempo con tu galgo elegido para asegurar un buen ajuste.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    className="w-10 h-auto flex-shrink-0"
                    src="https://c.animaapp.com/md6hg0hm7ohV8F/img/depth-4--frame-0-4.svg"
                    alt="Icono de Adopción"
                  />
                  <div>
                    <h3 className="font-sans font-medium text-text-heading text-base leading-6">
                      Adopción final
                    </h3>
                    <p className="font-sans font-normal text-text-muted text-base leading-6">
                      Dale la bienvenida a tu nuevo miembro de la familia.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="historias" className="px-4 py-8 md:py-12 scroll-mt-20">
            <FamilyStories />
          </section>

          {/* CTA Section */}
          <section id="adoptar" className="p-4 md:py-12 scroll-mt-20">
            <div>
              <div className="flex flex-col items-start gap-4 p-5 w-full bg-surface rounded-xl border border-primary">
                <p className="font-sans font-bold text-text-heading text-base leading-5">
                  Muchos galgos están esperando encontrar su hogar ideal. ¿Querés sumar un nuevo
                  miembro a tu familia?
                </p>
                <Link
                  href="/adoptar"
                  className="inline-flex items-center justify-center bg-primary text-text-on-primary text-sm font-medium py-1.5 px-4 rounded-2xl hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  Quiero adoptar
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>

    </div>
  )
}
