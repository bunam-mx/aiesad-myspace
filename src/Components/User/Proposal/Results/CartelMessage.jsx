const CartelMessage = () => {
  return (
    <div className="bg-gray-100 border-t-3 border-red-600 text-gray-700 text-sm leading-7 px-4 py-3 relative">
      <p>Nos complace informarle que su propuesta ha sido <strong className="font-bold">aceptada</strong> para presentar su trabajo en <strong className="font-bold">formato de póster</strong> en el <strong className="font-bold">XXI Encuentro AIESAD 2025</strong>.</p>
      <p>Su participación enriquecerá sin duda el diálogo y la reflexión colectiva durante el evento. Le pedimos estar atenta/o a futuras comunicaciones y no dude en escribirnos al correo <a href="mailto:encuentroaiesad2025@cuaed.unam.mx">encuentroaiesad2025@cuaed.unam.mx</a> si tiene alguna consulta.</p>
      <p>Le agradecemos su interés, compromiso y disposición para compartir su experiencia con nuestra comunidad.</p>
      <div className="mt-4">
        <p className="mb-2">Con un cordial saludo,</p>
        <p>El comité organizador</p>
        <p>XXI Encuentro AIESAD 2025</p>
        <p><a href="mailto:encuentroaiesad2025@cuaed.unam.mx">encuentroaiesad2025@cuaed.unam.mx</a></p>
      </div>
    </div>
  );
};

export default CartelMessage;
