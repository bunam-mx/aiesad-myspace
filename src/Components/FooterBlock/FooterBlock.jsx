import "./FooterBlock.css";

const FooterBlock = () => {
  return (
    <footer>
      <div className="container mx-auto py-10 px-6 md:px-20 text-gray-300">
        <div className="p-3 md:grid md:grid-cols-3 xl:grid-cols-12 text-sm">
          <div className="col-span-3 xl:col-span-12 px-3">
            <a href="https://cuaed.unam.mx/" target="_blank" rel="noopener noreferrer">
              <img src="/images/desarrollado_cuaed.svg" alt="Desarrollado por CUAED" width={154} />
            </a>
          </div>
          <div className="col-span-2 xl:col-span-9 leading-relaxed">
            <p>AVISO</p>
            <p>Coordinación de Universidad Abierta y Educación Digital de la UNAM. ©Todos los derechos reservados 2025. Hecho en México. Este sitio puede ser reproducido con fines no lucrativos, siempre y cuando no se mutile, se cite la fuente completa y su dirección electrónica, de otra forma, se requiere permiso previo por escrito de la Institución.</p>
            <p>Al navegar en este sitio, encontrará contenidos diseñados por académicos de la UNAM, denominados Contenidos Educativos Digitales (CED), disponibles para todo el público en forma gratuita. Los contenidos de cada CED son responsabilidad exclusiva de sus autores y no tienen impedimento en materia de propiedad intelectual; asimismo, no contienen información que por su naturaleza pueda considerarse confidencial y reservada.</p>
            <p>Los CED podrán ser utilizarlos sin fines de lucro, citando invariablemente la fuente y sin alterar la obra, respetando los términos institucionales de uso y los derechos de propiedad intelectual de terceros.</p>
          </div>
          <div className="md:pl-20 xl:col-start-10 xl:col-span-10 grid content-center">
            <ul>
              <li><a href="https://lib.cuaed.unam.mx/portales/directorio.html" target="_blank" rel="noopener noreferrer">Directorio</a></li>
              <li><a href="http://www.transparencia.unam.mx/" target="_blank" rel="noopener noreferrer">Transparencia</a></li>
              <li><a href="https://lib.cuaed.unam.mx/portales/documentos-personales.html" target="_blank" rel="noopener noreferrer">Datos personales</a></li>
              <li><a href="https://lib.cuaed.unam.mx/portales/aviso-privacidad-simplificado.html" target="_blank" rel="noopener noreferrer">Aviso de privacidad</a></li>
            </ul>
          </div>
          <div className="border-t border-gray-300 col-span-12">
            <p>
              Nuestras redes sociales
              <a href="https://www.facebook.com/unamcuaed" target="_blank" rel="noopener noreferrer" className="ml-2 inline-block"><i class="fab fa-facebook-f" aria-hidden="true"></i></a>
              <a href="https://www.instagram.com/cuaed.unam" target="_blank" rel="noopener noreferrer" className="ml-2 inline-block"><i class="fab fa-instagram" aria-hidden="true"></i></a>
              <a href="https://open.spotify.com/show/5hcNaky0xOg32H2eXCOUdo" target="_blank" rel="noopener noreferrer" className="ml-2 inline-block"><i class="fab fa-spotify" aria-hidden="true"></i></a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterBlock;
