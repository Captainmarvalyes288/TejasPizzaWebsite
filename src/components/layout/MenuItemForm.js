import Plus from "@/components/icons/Plus";
import Trash from "@/components/icons/Trash";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemPriceProps from "@/components/layout/MenuItemPriceProps";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function MenuItemForm({ onSubmit, menuItem }) {
  const [image, setImage] = useState(menuItem?.image || '');
  const [name, setName] = useState(menuItem?.name || '');
  const [description, setDescription] = useState(menuItem?.description || '');
  const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
  const [sizes, setSizes] = useState(menuItem?.sizes || []);
  const [category, setCategory] = useState(menuItem?.category || '');
  const [categories, setCategories] = useState([]);
  const [extraIngredientPrices, setExtraIngredientPrices] = useState(menuItem?.extraIngredientPrices || []);

  useEffect(() => {
    fetch('/api/categories').then(res => {
      res.json().then(categories => {
        setCategories(categories);
      });
    });
  }, []);

  function handleFormSubmit(ev) {
    ev.preventDefault();
    const data = {
      image, name, description, basePrice, sizes, extraIngredientPrices,
      category: category?.length > 0 ? category : null,
    };
    if (!data.image || !data.name || !data.description || !data.basePrice) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSubmit(ev, data);
  }

  return (
    <form onSubmit={handleFormSubmit} className="mt-8 max-w-2xl mx-auto">
      <div className="md:grid items-start gap-4">
        <div>
          <EditableImage link={image} setLink={setImage} />
        </div>
        <div className="grow">
          <label>Item name</label>
          <input
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
            required
          />
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            required
          />
          <label>Category</label>
          <select value={category} onChange={ev => setCategory(ev.target.value)} required>
            <option value="">Select a category</option>
            {categories?.length > 0 && categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <div>
          <label className="w-24 text-gray-600">Base price</label>
          <div className="flex items-center mt-2 mb-2">
            <span className="text-gray-600 mr-2 pt-1 pb-1">$</span>
            <input
              type="number"
              value={basePrice}
              onChange={ev => setBasePrice(ev.target.value)}
              required
              className="grow"
              step="0.01"
              min="0"
            />
          </div>
        </div>
          <MenuItemPriceProps
            name={'Sizes'}
            addLabel={'Add item size'}
            props={sizes}
            setProps={setSizes}
          />
          <MenuItemPriceProps
            name={'Extra ingredients'}
            addLabel={'Add ingredients prices'}
            props={extraIngredientPrices}
            setProps={setExtraIngredientPrices}
          />
          <button type="submit">Save</button>
        </div>
      </div>
    </form>
  );
}