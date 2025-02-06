const PricingInfo = () => {
  return (
    <div className="mb-6 p-4 bg-accent/10 rounded-lg text-sm">
      <p className="mb-2">
        La consultation pour les clients particuliers est de 50.000 FCFA et la consultation 
        pour les clients professionnels est à partir de 100.000 FCFA.
      </p>
      <p>
        La consultation est payée d'avance par mobile money:
      </p>
      <ul className="list-disc ml-4 mt-2">
        <li>Orange Money : 0707843777</li>
        <li>Wave : 0172248585</li>
      </ul>
      <p className="mt-2">
        Après paiement, vous pourrez confirmer l'heure et la date de votre rendez-vous. 
        Veuillez remplir ce formulaire en nous montrant la capture du reçu de votre consultation.
      </p>
    </div>
  );
};

export default PricingInfo;