import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      about: 'About Us',
      contact: 'Contact Us',
      cart: 'Cart',
      admin: 'Admin Panel',
      shop: 'Shop',
      
      // Navbar
      brandLogo: 'Embroidery Studio',
      
      // Hero
      heroTitle: 'Premium Machine Embroidery',
      heroSubtitle: 'Discover our exclusive collection of machine-embroidered clothing. Each piece is crafted with precision and care.',
      exploreCollection: 'Explore Collection',
      
      // Products
      ourCollection: 'Our Collection',
      browseProducts: 'Browse our finest machine-embroidered products',
      viewDetails: 'View Details',
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
      inStock: 'In Stock',
      price: 'Price',
      category: 'Category',
      type: 'Type',
      embroideryType: 'Embroidery Type',
      availability: 'Availability',
      quantity: 'Quantity',
      items: 'items',
      product: 'Product',
      whyChooseUs: 'Why Choose Us',
      weOffer: 'We provide premium embroidery services',
      close: 'Close',
      loadingProducts: 'Loading products...',
      retry: 'Retry',
      noProducts: 'No products available yet. Check back soon!',
      loadError: 'Failed to load products. Please try again later.',
      back: 'Back',
      
      // Features
      machinePrecision: 'Machine Precision',
      machinePrecisionDesc: 'Every design is embroidered with state-of-the-art machinery for perfect results',
      customDesigns: 'Custom Designs',
      customDesignsDesc: 'Choose from hundreds of patterns or create your own unique design',
      premiumQuality: 'Premium Quality',
      premiumQualityDesc: 'Only the finest materials and threads for long-lasting, vibrant embroidery',
      
      // Product Detail
      premiumQualityEmbroidery: 'Premium Quality Embroidery',
      machinePrecisionCrafted: 'Machine Precision Crafted',
      durableLongLasting: 'Durable & Long-lasting',
      
      // Cart
      shoppingCart: 'Shopping Cart',
      cartEmpty: 'Your Cart is Empty',
      cartEmptyDescription: 'No items in your cart yet. Start shopping now!',
      continueShopping: 'Continue Shopping',
      proceedCheckout: 'Proceed to Checkout',
      proceedCheckoutDemo: 'Proceed to Checkout (Demo)',
      clearCart: 'Clear Cart',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      free: 'Free',
      checkoutNote: 'Checkout functionality is for demonstration only',
      calculatedAtCheckout: 'Calculated at checkout',
      action: 'Action',
      
      // About
      aboutUs: 'About Us',
      aboutEmbroideryStudio: 'About Embroidery Studio',
      craftingExcellence: 'Crafting Excellence in Every Stitch Since 2015',
      ourStory: 'Our Story',
      ourStoryText: 'Embroidery Studio was born from a passion for blending traditional craftsmanship with modern technology. What started as a small workshop with a single embroidery machine has grown into a leading provider of premium machine-embroidered clothing.',
      ourJourney: 'Our journey began when our founder, inspired by generations of textile artisans, recognized the potential of combining time-honored embroidery techniques with state-of-the-art machinery. This vision has allowed us to create pieces that maintain the soul of handcrafted art while achieving the precision and consistency that modern technology offers.',
      ourCustomers: 'Today, we serve thousands of customers who appreciate quality, detail, and the unique character that machine embroidery brings to every garment. Each piece that leaves our studio is a testament to our commitment to excellence.',
      ourCoreValues: 'Our Core Values',
      qualityFirst: 'Quality First',
      qualityFirstDesc: 'We never compromise on the quality of our materials, threads, or craftsmanship.',
      innovation: 'Innovation',
      innovationDesc: 'Constantly evolving our techniques and designs to stay ahead of trends.',
      customerFocus: 'Customer Focus',
      customerFocusDesc: 'Your satisfaction drives everything we do, from design to delivery.',
      sustainability: 'Sustainability',
      sustainabilityDesc: 'Committed to eco-friendly practices and sustainable materials.',
      meetOurTeam: 'Meet Our Team',
      founderCEO: 'Founder & CEO',
      sarahJohnson: 'Sarah Johnson',
      sarahBio: 'Visionary leader with 15+ years in textile design and embroidery.',
      
      // Contact
      contactUs: 'Contact Us',
      getInTouch: 'Get In Touch',
      contactSubtitle: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      sendUsMessage: 'Send Us a Message',
      send: 'Send Message',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      success: 'Success!',
      successMessage: 'Thank you! Your message has been received successfully. We\'ll get back to you soon.',
      error: 'Error!',
      nameRequired: 'Name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Email is invalid',
      phoneRequired: 'Phone number is required',
      phoneInvalid: 'Phone number is invalid',
      messageRequired: 'Message is required',
      messageMinLength: 'Message must be at least 10 characters',
      
      // Contact Info
      contactInfo: 'Contact Info',
      infoEmail: 'info@embroiderystudio.com',
      infoPhone: '+1 (555) 123-4567',
      infoAddress: '123 Fashion Street, NY 10001',
      quickLinks: 'Quick Links',
      
      // Admin
      productManagement: 'Product Management',
      addProduct: 'Add Product',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      addNewProduct: 'Add New Product',
      updateProduct: 'Update Product',
      createProduct: 'Create Product',
      productUpdated: 'Product updated successfully!',
      productCreated: 'Product created successfully!',
      productDeleted: 'Product deleted successfully!',
      deleteConfirm: 'Are you sure you want to delete this product?',
      stock: 'Stock',
      image: 'Image',
      description: 'Description',
      actions: 'Actions',
      inStockLabel: 'In Stock',
      outOfStockLabel: 'Out of Stock',
      noProductsRow: 'No products available. Add your first product!',
      adminAccessTitle: 'Admin Access',
      adminAccessSubtitle: 'Enter your username and access code to manage products.',
      username: 'Username',
      accessCode: 'Access Code',
      unlock: 'Unlock',
      invalidCredentials: 'Invalid credentials. Please try again.',
      adminAccessGranted: 'Access granted. Loading products...',
      signOut: 'Sign out',

      // Footer
      footerTitle: 'Embroidery Studio',
      footerDescription: 'Premium machine-embroidered clothing for every occasion. Quality craftsmanship meets modern design.',
      footerCopyright: 'All Rights Reserved',
      
      // Common
      loading: 'Loading...'
    }
  },
  fr: {
    translation: {
      // Navigation
      home: 'Accueil',
      about: 'À propos',
      contact: 'Contact',
      cart: 'Panier',
      admin: 'Panneau Admin',
      shop: 'Boutique',
      
      // Navbar
      brandLogo: 'Studio de Broderie',
      
      // Hero
      heroTitle: 'Broderie Prémiée par Machine',
      heroSubtitle: 'Découvrez notre collection exclusive de vêtements brodés. Chaque pièce est confectionnée avec précision et soin.',
      exploreCollection: 'Explorer la Collection',
      
      // Products
      ourCollection: 'Notre Collection',
      browseProducts: 'Découvrez nos meilleurs produits brodés',
      viewDetails: 'Voir Détails',
      addToCart: 'Ajouter au Panier',
      outOfStock: 'Rupture de Stock',
      inStock: 'En Stock',
      price: 'Prix',
      category: 'Catégorie',
      type: 'Type',
      embroideryType: 'Type de Broderie',
      availability: 'Disponibilité',
      quantity: 'Quantité',
      items: 'articles',
      product: 'Produit',
      whyChooseUs: 'Pourquoi Nous Choisir',
      weOffer: 'Nous offrons des services de broderie premium',
      close: 'Fermer',
      loadingProducts: 'Chargement des produits...',
      retry: 'Réessayer',
      noProducts: 'Aucun produit disponible pour le moment. Revenez bientôt !',
      loadError: 'Impossible de charger les produits. Réessayez plus tard.',
      back: 'Retour',
      
      // Features
      machinePrecision: 'Précision de Machine',
      machinePrecisionDesc: 'Chaque design est brodé avec des machines dernier cri pour des résultats parfaits',
      customDesigns: 'Designs Personnalisés',
      customDesignsDesc: 'Choisissez parmi des centaines de motifs ou créez votre propre design unique',
      premiumQuality: 'Qualité Première',
      premiumQualityDesc: 'Seulement les meilleurs matériaux et fils pour une broderie durable et vibrante',
      
      // Product Detail
      premiumQualityEmbroidery: 'Broderie de Qualité Premium',
      machinePrecisionCrafted: 'Réalisée avec Précision Machinal',
      durableLongLasting: 'Durable & Longue Tenue',
      
      // Cart
      shoppingCart: 'Panier',
      cartEmpty: 'Votre Panier est Vide',
      cartEmptyDescription: 'Aucun article pour le moment. Commencez vos achats !',
      continueShopping: 'Continuer vos Achats',
      proceedCheckout: 'Procéder au Paiement',
      proceedCheckoutDemo: 'Procéder au paiement (démo)',
      clearCart: 'Vider le Panier',
      orderSummary: 'Résumé de la Commande',
      subtotal: 'Sous-total',
      shipping: 'Livraison',
      tax: 'Taxe',
      total: 'Total',
      free: 'Gratuit',
      checkoutNote: 'Le paiement est uniquement pour la démo',
      calculatedAtCheckout: 'Calculé au paiement',
      action: 'Action',
      
      // About
      aboutUs: 'À Propos de Nous',
      aboutEmbroideryStudio: 'À Propos du Studio de Broderie',
      craftingExcellence: 'Fabriquer l\'Excellence dans Chaque Point Depuis 2015',
      ourStory: 'Notre Histoire',
      ourStoryText: 'Studio de Broderie est né d\'une passion pour fusionner l\'artisanat traditionnel avec la technologie moderne. Ce qui a commencé comme un petit atelier avec une seule machine à broder est devenu un fournisseur leader de vêtements de broderie à la machine premium.',
      ourJourney: 'Notre voyage a commencé lorsque notre fondateur, inspiré par des générations d\'artisans textiles, a reconnu le potentiel de combiner les techniques de broderie traditionnelles avec la machinerie de pointe. Cette vision nous a permis de créer des pièces qui conservent l\'âme de l\'art fait à la main tout en réalisant la précision et la cohérence que la technologie moderne offre.',
      ourCustomers: 'Aujourd\'hui, nous servons des milliers de clients qui apprécient la qualité, les détails et le caractère unique que la broderie à la machine apporte à chaque vêtement. Chaque pièce qui quitte notre studio est un témoignage de notre engagement envers l\'excellence.',
      ourCoreValues: 'Nos Valeurs Fondamentales',
      qualityFirst: 'La Qualité d\'Abord',
      qualityFirstDesc: 'Nous ne compromettont jamais sur la qualité de nos matériaux, fils ou artisanat.',
      innovation: 'Innovation',
      innovationDesc: 'Évolution constante de nos techniques et designs pour rester à la pointe des tendances.',
      customerFocus: 'Orientation Client',
      customerFocusDesc: 'Votre satisfaction guide tout ce que nous faisons, de la conception à la livraison.',
      sustainability: 'Durabilité',
      sustainabilityDesc: 'Engagés envers les pratiques écologiques et les matériaux durables.',
      meetOurTeam: 'Rencontrez Notre Équipe',
      founderCEO: 'Fondateur & PDG',
      sarahJohnson: 'Sarah Johnson',
      sarahBio: 'Leader visionnaire avec 15+ ans dans la conception textile et la broderie.',
      
      // Contact
      contactUs: 'Contactez-nous',
      getInTouch: 'Mettez-vous en Relation',
      contactSubtitle: 'Des questions ? Nous aimerions vous entendre. Envoyez-nous un message et nous répondrons dès que possible.',
      sendUsMessage: 'Envoyez-nous un Message',
      send: 'Envoyer',
      name: 'Nom',
      email: 'E-mail',
      phone: 'Téléphone',
      message: 'Message',
      success: 'Succès !',
      successMessage: 'Merci ! Votre message a été reçu avec succès. Nous vous recontacterons bientôt.',
      error: 'Erreur !',
      nameRequired: 'Le nom est requis',
      emailRequired: 'L\'email est requis',
      emailInvalid: 'L\'email n\'est pas valide',
      phoneRequired: 'Le numéro de téléphone est requis',
      phoneInvalid: 'Le numéro de téléphone n\'est pas valide',
      messageRequired: 'Le message est requis',
      messageMinLength: 'Le message doit contenir au moins 10 caractères',
      
      // Contact Info
      contactInfo: 'Informations de Contact',
      infoEmail: 'info@embroiderystudio.com',
      infoPhone: '+1 (555) 123-4567',
      infoAddress: '123 Fashion Street, NY 10001',
      quickLinks: 'Liens Rapides',
      
      // Admin
      productManagement: 'Gestion des Produits',
      addProduct: 'Ajouter Produit',
      edit: 'Éditer',
      delete: 'Supprimer',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      addNewProduct: 'Ajouter un produit',
      updateProduct: 'Mettre à jour',
      createProduct: 'Créer un produit',
      productUpdated: 'Produit mis à jour avec succès !',
      productCreated: 'Produit créé avec succès !',
      productDeleted: 'Produit supprimé avec succès !',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
      stock: 'Stock',
      image: 'Image',
      description: 'Description',
      actions: 'Actions',
      inStockLabel: 'En stock',
      outOfStockLabel: 'Rupture',
      noProductsRow: 'Aucun produit. Ajoutez le premier !',
      adminAccessTitle: 'Accès administrateur',
      adminAccessSubtitle: 'Entrez votre nom d\'utilisateur et code d\'accès pour gérer les produits.',
      username: 'Nom d\'utilisateur',
      accessCode: 'Code d\'accès',
      unlock: 'Déverrouiller',
      invalidCredentials: 'Identifiants invalides. Réessayez.',
      adminAccessGranted: 'Accès accordé. Chargement des produits...',
      signOut: 'Déconnexion',

      // Footer
      footerTitle: 'Studio de Broderie',
      footerDescription: 'Vêtements de broderie à la machine premium pour chaque occasion. L\'artisanat de qualité rencontre la conception moderne.',
      footerCopyright: 'Tous Droits Réservés',
      
      // Common
      loading: 'Chargement...'
    }
  },
  sq: {
    translation: {
      // Navigation
      home: 'Kreu',
      about: 'Rreth Nesh',
      contact: 'Kontakto',
      cart: 'Shporta',
      admin: 'Paneli Admin',
      shop: 'Dyqani',
      
      // Hero
      heroTitle: 'Qëndisje makinerike premium',
      heroSubtitle: 'Zbuloni koleksionin tonë ekskluziv të veshjeve të qëndisura me makinë. Çdo pjesë është punuar me kujdes dhe saktësi.',
      exploreCollection: 'Shfleto Koleksionin',
      
      // Products
      ourCollection: 'Koleksioni Ynë',
      browseProducts: 'Shfleto produktet tona më të mira të qëndisura',
      viewDetails: 'Shiko Detajet',
      addToCart: 'Shto në Shportë',
      outOfStock: 'S’ka në stok',
      inStock: 'Në Stok',
      price: 'Çmimi',
      category: 'Kategoria',
      type: 'Lloji',
      embroideryType: 'Lloji i Qëndisjes',
      availability: 'Disponueshmëria',
      quantity: 'Sasia',
      items: 'artikuj',
      product: 'Produkti',
      whyChooseUs: 'Pse Zgjidh Ne',
      weOffer: 'Ofron shërbime premium të qëndisjes',
      close: 'Mbyll',
      loadingProducts: 'Duke ngarkuar produktet...',
      retry: 'Riprovo',
      noProducts: 'Nuk ka ende produkte. Kthehu së shpejti!',
      loadError: 'Produktet nuk u ngarkuan. Provo përsëri më vonë.',
      back: 'Mbrapa',
      
      // Features
      machinePrecision: 'Saktësi makinerike',
      machinePrecisionDesc: 'Çdo dizajn qëndiset me makineri moderne për rezultate perfekte',
      customDesigns: 'Dizajne të personalizuara',
      customDesignsDesc: 'Zgjidh nga qindra modele ose krijo dizajnin tënd unik',
      premiumQuality: 'Cilësi e lartë',
      premiumQualityDesc: 'Materiale dhe fije cilësore për qëndrueshmëri dhe ngjyra të forta',
      
      // Product Detail
      premiumQualityEmbroidery: 'Qëndisje Cilësore Premium',
      machinePrecisionCrafted: 'I Punuar me Saktësi Makinerike',
      durableLongLasting: 'I Qëndrueshëm & Zgjatja e Gjatë',
      
      // Cart
      shoppingCart: 'Shporta e blerjeve',
      cartEmpty: 'Shporta është bosh',
      cartEmptyDescription: 'Nuk ka ende artikuj. Fillo blerjet tani!',
      continueShopping: 'Vazhdo blerjet',
      proceedCheckout: 'Vazhdo te pagesa',
      proceedCheckoutDemo: 'Vazhdo te pagesa (demo)',
      clearCart: 'Pastro shportën',
      orderSummary: 'Përmbledhja e Porositës',
      subtotal: 'Nëntotal',
      shipping: 'Transporti',
      tax: 'Taksa',
      total: 'Totali',
      free: 'Falas',
      checkoutNote: 'Pagesa është vetëm demonstrim',
      calculatedAtCheckout: 'Llogaritet në pagesë',
      action: 'Veprimi',
      
      // About
      aboutUs: 'Rreth Nesh',
      aboutEmbroideryStudio: 'Rreth Studio të Qëndisjes',
      craftingExcellence: 'Punoni Përsosmërinë në Çdo Pike Që nga 2015',
      ourStory: 'Historia jonë',
      ourStoryText: 'Studio i Qëndisjes lindi nga pasioni për të kombinuar mjeshtërinë tradicionale me teknologjinë moderne. Ajo që filloi si një punishte e vogël me një makinë qëndisje është bërë një furnizues zyrtar i veshjeve të qëndisjeve të makinës premium.',
      ourJourney: 'Udhëtimi ynë filloi kur themeluesja ynë, e frymëzuar nga brezat e artizanëve tekstilë, e njoh potencialin e kombinimit të teknikave tradicionale të qëndisjes me makineri të fundit të artit. Kjo vizion na ka lejuar të krijojmë copëza që mbajnë shpirtin e artit të bërë me dorë ndërsa arrijmë saktësinë dhe përputhshmërinë që ofron teknologjia moderne.',
      ourCustomers: 'Sot, ne shërbenim mijëra klientëve që vlerësojnë cilësinë, detajet dhe karakterin unik që qëndisja me makinë i jep çdo veshjeje. Çdo copëz që del nga studio ynë është dëshmi e përkushtimit tonë ndaj përsosmërisë.',
      ourCoreValues: 'Vlerat tona Themelore',
      qualityFirst: 'Cilësia Përpara',
      qualityFirstDesc: 'Nuk kurrë komprometojmë cilësinë e materialeve, fijeve ose mjeshtësisë ynë.',
      innovation: 'Inovacion',
      innovationDesc: 'Duke evoluuar vazhdimisht teknikat dhe dizajnet tona për të qëndruar përpara trendit.',
      customerFocus: 'Fokusi në Klient',
      customerFocusDesc: 'Kënaqësia juaj shpenzob gjithçka të bëjmë, nga dizajni deri në dorëzim.',
      sustainability: 'Qëndrueshmëri',
      sustainabilityDesc: 'I angazhuar në praktikat miqësore ndaj mjedisit dhe materialet e qëndrueshme.',
      meetOurTeam: 'Takoni Ekipin Tonë',
      founderCEO: 'Themeluesja & Drejtore',
      sarahJohnson: 'Sarah Johnson',
      sarahBio: 'Lider me vizion me 15+ vite në dizajnin tekstil dhe qëndisjen.',
      
      // Contact
      contactUs: 'Na kontaktoni',
      getInTouch: 'Hyni në Kontakt',
      contactSubtitle: 'A keni pyetje? Bisht të dëgjojmë. Na dërgoni një mesazh dhe do t\'u përgjigjemi sa më shpejt të jetë e mundur.',
      sendUsMessage: 'Na Dërgoni një Mesazh',
      send: 'Dërgo Mesazhin',
      name: 'Emri',
      email: 'Email',
      phone: 'Telefoni',
      message: 'Mesazhi',
      success: 'Sukses!',
      successMessage: 'Faleminderit! Mesazhi juaj u mor me sukses. Ne do t\'u kontaktojmë së shpejti.',
      error: 'Gabim!',
      nameRequired: 'Emri është i detyrueshëm',
      emailRequired: 'Email-i është i detyrueshëm',
      emailInvalid: 'Email-i nuk është i vlefshëm',
      phoneRequired: 'Numri i telefonit është i detyrueshëm',
      phoneInvalid: 'Numri i telefonit nuk është i vlefshëm',
      messageRequired: 'Mesazhi është i detyrueshëm',
      messageMinLength: 'Mesazhi duhet të ketë të paktën 10 karaktere',
      
      // Contact Info
      contactInfo: 'Informacion Kontakti',
      infoEmail: 'info@embroiderystudio.com',
      infoPhone: '+1 (555) 123-4567',
      infoAddress: '123 Fashion Street, NY 10001',
      quickLinks: 'Lidhje të Shpejtë',
      
      // Admin
      productManagement: 'Menaxhimi i produkteve',
      addProduct: 'Shto produkt',
      edit: 'Ndrysho',
      delete: 'Fshi',
      save: 'Ruaj',
      cancel: 'Anulo',
      addNewProduct: 'Shto produkt të ri',
      updateProduct: 'Përditëso produktin',
      createProduct: 'Krijo produkt',
      productUpdated: 'Produkti u përditësua me sukses!',
      productCreated: 'Produkti u krijua me sukses!',
      productDeleted: 'Produkti u fshi me sukses!',
      deleteConfirm: 'Je i sigurt që dëshiron të fshish këtë produkt?',
      stock: 'Stoku',
      image: 'Imazhi',
      description: 'Përshkrimi',
      actions: 'Veprimet',
      inStockLabel: 'Në stok',
      outOfStockLabel: 'S’ka në stok',
      noProductsRow: 'Nuk ka produkte. Shto të parin!',
      adminAccessTitle: 'Hyrje admini',
      adminAccessSubtitle: 'Vendos emrin e përdoruesit dhe kodin e aksesit për të menaxhuar produktet.',
      username: 'Përdoruesi',
      accessCode: 'Kodi i aksesit',
      unlock: 'Hape',
      invalidCredentials: 'Kredenciale të pavlefshme. Provo sërish.',
      adminAccessGranted: 'Aksesi u lejua. Po ngarkojmë produktet...',
      signOut: 'Dil',

      // Footer
      footerTitle: 'Studio i Qëndisjes',
      footerDescription: 'Veshje me qëndisje makinerike premium për çdo rast. Mjeshtësia e cilësisë përket dizajnit modern.',
      footerCopyright: 'Të Gjitha të Drejtat e Rezervuara',
      
      // Common
      loading: 'Duke ngarkuar...'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
