import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import { getSocialTokensByUser } from "@/lib/actions/socialToken.actions";

const PageDropdown = ({ value, onChangeHandler, userId }) => {
  const [pages, setPages] = useState([]);

  const handleChange = (e) => {
    onChangeHandler(e);
  };

  useEffect(() => {
    const getPages = async () => {
      const pageList = await getSocialTokensByUser({
        userId: userId,
        page: 1,
      });
      pageList && setPages(pageList.data);
    };

    getPages();
  }, []);

  return (
    <Select onValueChange={handleChange} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Connect Page" />
      </SelectTrigger>
      <SelectContent>
        {pages.length > 0 &&
          pages.map((page) => (
            <SelectItem
              key={page._id}
              value={page._id}
              className="select-item p-regular-14"
            >
              {page.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default PageDropdown;
