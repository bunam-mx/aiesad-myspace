const NoApprovedMessage = () => {
  return (
    <div className="bg-gray-100 border-t-3 border-red-600 text-gray-700 text-sm leading-7 px-4 py-3 relative">
      <p>Agradecemos sinceramente el envío de su propuesta al XXI Encuentro regional de AIESAD 2025. Valoramos profundamente el tiempo, el esfuerzo y la disposición para compartir su trabajo con nuestra comunidad académica.</p>
      <p>Después de una cuidadosa revisión por parte del comité evaluador, lamentamos informarle que su propuesta no ha sido seleccionada para formar parte del programa en esta ocasión. Esta decisión se tomó considerando los criterios establecidos en la convocatoria y buscando mantener la coherencia temática y el equilibrio general del evento.</p>
      <p>Queremos enfatizar que para este evento hemos recibido un número significativo de contribuciones de alta calidad, lo cual ha hecho que el proceso de selección sea especialmente exigente.</p>
      <p>Le animamos a continuar desarrollando su línea de trabajo y, si lo desea, a participar en futuras ediciones o espacios de colaboración académica que impulsen el intercambio de saberes y experiencias.</p>
      <p>Esperamos que le sea posible acompañarnos al Encuentro y le hacemos llegar un cordial saludo.</p>
      <div className="mt-4">
        <p className="mb-2">Atentamente,</p>
        <p>El comité organizador</p>
        <p>XXI Encuentro AIESAD 2025</p>
        <p><a href="mailto:encuentroaiesad2025@cuaed.unam.mx">encuentroaiesad2025@cuaed.unam.mx</a></p>
      </div>
    </div>
  );
};

export default NoApprovedMessage;
