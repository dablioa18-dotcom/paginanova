export const categories = [
  "suplementos",
  "Creatina ",
  "barras-de-cereais ",
  "Pré-treinos",
  "encapsulasdos",
  "pastas",
  "Prétreino",
  "Roupas",
];

export const products = [
  {
    id: "Whey-900g", // ID único do produto
    name: "Whey 100% Pure Integralmedicine 900g", // Nome do produto
    realPrice: 161.9, // Preço real sem desconto
    price: 42.99, // Preço com desconto
    image: "/imgProdutos/Whey900g.png",// Imagem principal do produto
    category: "suplementos",
    featured: true,
    brand: "Integralmedicine", // Marca do produto
    images: [ // Imagens adicionais do produto
      "/imgProdutos/Whey900g.png",
      "/imgProdutos/Whey900g-1.png",
      "/imgProdutos/Whey900g-2.png",
      "/imgProdutos/Whey900g-3.png"
    ],
    variants: [ //caso tenha mais de uma opçao de sabor para o msm produto
      { id: "baunilha", label: "Baunilha" }, // opção de sabor baunilha
      { id: "chocolate", label: "Chocolate" }, // opção de sabor chocolate
      { id: "morango", label: "Morango" } // opção de sabor morango
    ],

    //
  },
  {
    id: "creatina-plus",
    name: "Creatina Plus",
    realPrice: 67.90,
    price: 45.99,
    image: "/imgProdutos/CreatinaMax.png",
    category: "suplementos",  
    featured: true,
    brand: "Growth/Integral",
    images: ["/imgProdutos/CreatinaMax.png"],// imagem principal do produto na pagina de detalhes sobre o msm
  },
  {
    id: "pre-workout-pro",
    name: "Pré-treino Pro",
    price: 119.9,
    image: "/imgProdutos/DilapumAdaptogen.png",
    category: "Pré-treinos",
    featured: true,
    brand: "Adaptogen/Max",
    images: ["/imgProdutos/DilapumAdaptogen.png"],
  },
  {
    id: "kit-whey-creatina",
    name: "Kit Whey + Creatina",
    price: 179.9,
    image: "/imgProdutos/WheyKitDuble.png",
    category: "suplementos",
    featured: true,
    brand: "Mix",
    images: [
      "/imgProdutos/WheyKitDuble.png",
      "/imgProdutos/wheySaborbunilhaCreatina.png"
    ],
    isKit: true,
  },
  {
    id: "multivitamin",
    name: "Multivitamínico Elite",
    price: 79.9,
    image: "/images/vitamin.svg",
    category: "Vitaminas",
  },
  {
    id: "whey-1kg",
    name: "Whey Protein 1kg",
    price: 109.9,
    image: "/imgProdutos/whey1kg.png",
    category: "suplementos",
    brand: "Max/Integral",
    images: [
      "/imgProdutos/whey1kg.png",
      "/imgProdutos/whey1kg-1.png",
      "/imgProdutos/whey1kgSabor.png"
    ],
    variants: [ // Variantes do produto (opções de sabor e tipos)
      { id: "baunilha", label: "Baunilha" },
      { id: "chocolate", label: "Chocolate" },
      { id: "morango", label: "Morango" }
    ],
  },

];