import React, { useEffect, useState } from "react";
import Cards from "../../components/Cards";
import { FaFilter, FaExclamationTriangle } from "react-icons/fa";
import { useTheme } from "../../hooks/ThemeContext";

const Menu = () => {
  const { isDarkMode } = useTheme();
  const [menu, setMenu] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [showAllergyModal, setShowAllergyModal] = useState(false);

  const allergyList = [
    { name: "Nuts", ingredients: ["walnuts", "pine nuts", "almonds", "Peanut butter", "orgeat syrup", "peanuts"] },
    { name: "Dairy Products", ingredients: ["feta", "mozzarella", "parmesan", "fontina", "cream", "Gruyère cheese", "Cream cheese", "Mascarpone", "coconut milk", "milk", "butter"] },
    { name: "Seafood", ingredients: ["anchovies", "tuna", "salmon", "shrimp", "calamari", "prawns", "fish stock", "fish"] }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://complete-foodi-client-server-l9jv.onrender.com/menu");
        const data = await response.json();
        setMenu(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filterItems = (category) => {
    let filtered = menu;

    if (category !== "all") {
      filtered = filtered.filter((item) => item.category === category);
    }

    filtered = filterByAllergies(filtered);

    setFilteredItems(filtered);
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const filterByAllergies = (items) => {
    if (selectedAllergies.length === 0) return items;

    return items.filter((item) => {
      const recipe = item.recipe.toLowerCase();
      return !selectedAllergies.some((allergy) => 
        allergyList.find(a => a.name === allergy).ingredients.some(ingredient => 
          recipe.includes(ingredient.toLowerCase())
        )
      );
    });
  };

  const showAll = () => {
    setFilteredItems(filterByAllergies(menu));
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    let sortedItems = [...filteredItems];

    switch (option) {
      case "A-Z":
        sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z-A":
        sortedItems.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "low-to-high":
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredItems(sortedItems);
    setCurrentPage(1);
  };

  const handleAllergyChange = (allergy) => {
    setSelectedAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy) 
        : [...prev, allergy]
    );
  };

  useEffect(() => {
    filterItems(selectedCategory);
  }, [selectedAllergies]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const AllergyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className={`bg-white p-6 rounded-lg shadow-xl max-w-md w-full ${isDarkMode ? 'dark:bg-gray-800' : ''}`}>
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Select Your Allergies</h2>
        <div className="space-y-2">
          {allergyList.map((allergy) => (
            <label key={allergy.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedAllergies.includes(allergy.name)}
                onChange={() => handleAllergyChange(allergy.name)}
                className="form-checkbox h-5 w-5 text-green-600"
              />
              <span className={`${isDarkMode ? 'text-white' : 'text-black'}`}>{allergy.name}</span>
            </label>
          ))}
        </div>
        <button
          onClick={() => setShowAllergyModal(false)}
          className="mt-4 bg-green text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <div>
       {/* menu banner */}
      <div className={`max-w-screen-2xl container mx-auto xl:px-24 px-4 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100% ${isDarkMode ? "dark" : ""}`}>
        <div className="py-48 flex flex-col items-center justify-center">
          <div className=" text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              For the Love of Delicious <span className="text-green">Food</span>
            </h2>
            <p className="text-[#4A4A4A] text-xl md:w-4/5 mx-auto">
              Come with family & feel the joy of mouthwatering food such as
              Greek Salad, Lasagne, Butternut Pumpkin, Tokusen Wagyu, Olivas
              Rellenas and more for a moderate cost
            </p>
            <button className="bg-green font-semibold btn text-white px-8 py-3 rounded-full">
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* menu shop  */}
      <div className="section-container mt-8"> {/* Added mt-8 for top margin */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Allergy filter button */}
          <button
            onClick={() => setShowAllergyModal(true)}
            className="mb-4 md:mb-0 bg-green text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-green-600 transition duration-300"
          >
            <FaExclamationTriangle />
            <span>Allergy Filter</span>
            {selectedAllergies.length > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {selectedAllergies.length}
              </span>
            )}
          </button>

          {/* Category buttons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <button onClick={showAll} className={selectedCategory === "all" ? "active" : ""}>All</button>
            <button onClick={() => filterItems("salad")} className={selectedCategory === "salad" ? "active" : ""}>Salad</button>
            <button onClick={() => filterItems("pizza")} className={selectedCategory === "pizza" ? "active" : ""}>Pizza</button>
            <button onClick={() => filterItems("soup")} className={selectedCategory === "soup" ? "active" : ""}>Soups</button>
            <button onClick={() => filterItems("dessert")} className={selectedCategory === "dessert" ? "active" : ""}>Desserts</button>
            <button onClick={() => filterItems("drinks")} className={selectedCategory === "drinks" ? "active" : ""}>Drinks</button>
          </div>

          {/* Sort options */}
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <FaFilter className="text-gray-600" />
            <select
              onChange={(e) => handleSortChange(e.target.value)}
              value={sortOption}
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="default">Default</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active allergy filters display */}
        {selectedAllergies.length > 0 && (
          <div className="mb-4 p-2 bg-yellow-100 rounded-lg">
            <p className="font-semibold">Active Allergy Filters:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedAllergies.map(allergy => (
                <span key={allergy} className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-sm">
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* product card */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
          {currentItems.map((item) => (
            <Cards key={item._id} item={item} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center my-8 flex-wrap gap-2">
        {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-3 py-1 rounded-full ${
              currentPage === index + 1 ? "bg-green text-white" : "bg-gray-200"
            } ${isDarkMode ? "dark border" : ""}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {showAllergyModal && <AllergyModal />}
    </div>
  );
};

export default Menu;