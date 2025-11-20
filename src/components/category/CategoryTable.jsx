import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { Link } from "react-router-dom";
import { IoRemoveSharp } from "react-icons/io5";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useState } from "react";

//internal import

import CheckBox from "@/components/form/others/CheckBox";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import CategoryDrawer from "@/components/drawer/CategoryDrawer";
import ShowHideButton from "@/components/table/ShowHideButton";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const CategoryTable = ({
  data,
  lang,
  isCheck,
  categories,
  setIsCheck,
  useParamId,
  showChild,
}) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const { showingTranslateValue } = useUtilsFunction();
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (categoryId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  return (
    <>
      {isCheck?.length < 1 && (
        <DeleteModal useParamId={useParamId} id={serviceId} title={title} />
      )}

      <MainDrawer>
        <CategoryDrawer id={serviceId} data={data} lang={lang} />
      </MainDrawer>

      <TableBody>
        {categories?.map((category) => (
          <TableRow key={category._id}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name="category"
                id={category._id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(category._id)}
              />
            </TableCell>

            <TableCell className="font-semibold uppercase text-xs">
              {category?._id?.substring(20, 24)}
            </TableCell>
            <TableCell>
              {category?.icon ? (
                <Avatar
                  className="hidden mr-3 md:block bg-gray-50 p-1"
                  src={category?.icon}
                  alt={category?.parent}
                />
              ) : (
                <Avatar
                  src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                  alt="product"
                  className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                />
              )}
            </TableCell>

            <TableCell className="font-medium text-sm ">
              {category?.children.length > 0 ? (
                <Link
                  to={`/categories/${category?._id}`}
                  className="text-blue-700"
                >
                  {showingTranslateValue(category?.name)}

                  <>
                    {showChild && (
                      <>
                        {" "}
                        <div className="pl-2 ">
                          {category?.children?.map((child) => (
                            <div key={child._id}>
                              <Link
                                to={`/categories/${child?._id}`}
                                className="text-blue-700"
                              >
                                <div className="flex text-xs items-center  text-blue-800">
                                  <span className=" text-xs text-gray-500 pr-1">
                                    <IoRemoveSharp />
                                  </span>
                                  <span className="text-gray-500">
                                    {showingTranslateValue(child.name)}
                                  </span>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                </Link>
              ) : (
                <span>{showingTranslateValue(category?.name)}</span>
              )}
            </TableCell>
            <TableCell className="text-sm">
              {category?.children && category?.children.length > 0 ? (
                <div>
                  <button
                    onClick={() => toggleRow(category._id)}
                    className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
                  >
                    {expandedRows[category._id] ? (
                      <FiChevronDown className="w-4 h-4" />
                    ) : (
                      <FiChevronRight className="w-4 h-4" />
                    )}
                    <span className="text-xs">
                      {category.children.length}{" "}
                      {category.children.length === 1
                        ? "Subcategory"
                        : "Subcategories"}
                    </span>
                  </button>
                  {expandedRows[category._id] && (
                    <div className="mt-2 ml-4 space-y-1.5 border-l-2 border-emerald-200 pl-3">
                      {category.children.map((child) => (
                        <div
                          key={child._id}
                          className="flex items-center text-xs"
                        >
                          <span className="text-gray-400 pr-1.5">
                            <IoRemoveSharp />
                          </span>
                          <Link
                            to={`/categories/${child._id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {showingTranslateValue(child.name)}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-gray-400 text-xs italic">
                  No subcategories
                </span>
              )}
            </TableCell>

            <TableCell className="text-center">
              <ShowHideButton
                id={category._id}
                category
                status={category.status}
              />
            </TableCell>
            <TableCell>
              <EditDeleteButton
                id={category?._id}
                parent={category}
                isCheck={isCheck}
                children={category?.children}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(category?.name)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CategoryTable;
