import HeaderBlock from "../../HeaderBlock/HeaderBlock";
import FooterBlock from "../../FooterBlock/FooterBlock";

const Agenda = () => {
  return (
    <>
      <HeaderBlock />
      <section id="agenda" className="container mx-auto min-h-170 p-10">
        <h2 className="text-yellow-aiesad text-4xl mb-6">Mi agenda</h2>
        <div>
          <iframe
            src="https://calendar.google.com/calendar/embed?src=encuentroaiesad2025%40cuaed.unam.mx&ctz=America%2FMexico_City"
            style={{ border: 0 }}
            width="800"
            height="600"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </div>
      </section>
      <FooterBlock />
    </>
  );
}

export default Agenda;
