const ApprovedMessage = () => {
  return (
    <div className="border-t-3 border-green-600 bg-gray-100 text-gray-700 text-sm leading-7 px-4 py-3 relative">
      <p>Nos complace informarle que su propuesta ha sido <strong className="font-bold">aceptada</strong> para formar parte del <strong className="font-bold">programa</strong> del <strong className="font-bold">XXI Encuentro AIESAD 2025</strong>, tras una revisión cuidadosa por parte del Comité evaluador.</p>
      <p>Valoramos especialmente su contribución al enfoque innovador, académico y social que este espacio busca promover. Su participación enriquecerá sin duda el diálogo y la reflexión colectiva durante el evento.</p>
      <p>En los próximos días recibirá información adicional sobre detalles logísticos de su presentación. Le pedimos estar atenta/o a futuras comunicaciones y no dude en escribirnos si tiene alguna consulta. Si requiere una carta de aceptación, por favor solicítela a este correo:</p>
      <p><a href="mailto:encuentroaiesad2025@cuaed.unam.mx">encuentroaiesad2025@cuaed.unam.mx</a></p>
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

export default ApprovedMessage;
