import {
  Avatar,
  Badge,
  TableBody,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import { t } from "i18next";
import { FiZoomIn, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";

//internal import
import MainDrawer from "@/components/drawer/MainDrawer";
import ProductDrawer from "@/components/drawer/ProductDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ShowHideButton from "@/components/table/ShowHideButton";
import Tooltip from "@/components/tooltip/Tooltip";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useUtilsFunction from "@/hooks/useUtilsFunction";

//internal import

const ProductTable = ({ products, isCheck, setIsCheck }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const { currency, showingTranslateValue, getNumberTwo } = useUtilsFunction();
  const [expandedVariants, setExpandedVariants] = useState({});

  const handleClick = (e) => {
    const { id, checked } = e.target;
    // console.log("id", id, checked);

    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const toggleVariantDropdown = (productId) => {
    setExpandedVariants((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const renderVariantsDetail = (product) => {
    if (
      !product?.isCombination ||
      !product?.variants ||
      product.variants.length === 0
    ) {
      return <span className="text-xs text-gray-400">No variants</span>;
    }

    const sizeVariants = product.variants.filter(
      (v) => v.variantType === "size"
    );
    const isExpanded = expandedVariants[product._id];

    if (sizeVariants.length === 0) {
      return (
        <span className="text-xs text-gray-600">
          {product.variants.length} variant(s)
        </span>
      );
    }

    return (
      <div className="relative">
        <button
          onClick={() => toggleVariantDropdown(product._id)}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-brown-700 bg-brown-50 hover:bg-brown-100 dark:bg-brown-900 dark:text-brown-300 dark:hover:bg-brown-800 rounded transition-colors"
        >
          <span>
            {sizeVariants.length} Size Variant
            {sizeVariants.length > 1 ? "s" : ""}
          </span>
          {isExpanded ? (
            <FiChevronUp className="w-3 h-3" />
          ) : (
            <FiChevronDown className="w-3 h-3" />
          )}
        </button>

        {isExpanded && (
          <div className="absolute z-50 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto">
            <div className="p-2 space-y-2">
              {sizeVariants.map((variant, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-brown-50 dark:bg-brown-900 rounded border border-brown-200 dark:border-brown-700"
                >
                  <div className="font-semibold text-xs text-brown-800 dark:text-brown-200 mb-1">
                    {variant.combination}
                  </div>
                  {variant.pricingTiers && variant.pricingTiers.length > 0 && (
                    <div className="space-y-1">
                      {variant.pricingTiers.map((tier, tIdx) => (
                        <div
                          key={tIdx}
                          className="flex items-center justify-between text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded"
                        >
                          <span className="text-brown-600 dark:text-brown-400 font-medium">
                            {tier.quantity} pcs
                          </span>
                          <div className="flex items-center gap-2">
                            {tier.discount > 0 && (
                              <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded text-xs font-semibold">
                                {tier.discount}% off
                              </span>
                            )}
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              {currency} {tier.finalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isCheck?.length < 1 && <DeleteModal id={serviceId} title={title} />}

      {isCheck?.length < 2 && (
        <MainDrawer>
          <ProductDrawer currency={currency} id={serviceId} />
        </MainDrawer>
      )}

      <TableBody>
        {products?.map((product, i) => (
          <TableRow key={i + 1}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name={product?.title?.en}
                id={product._id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(product._id)}
              />
            </TableCell>

            <TableCell>
              <div className="flex items-center">
                {product?.image[0] ? (
                  <Avatar
                    className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none"
                    src={product?.image[0]}
                    alt="product"
                  />
                ) : (
                  <Avatar
                    src={`https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png`}
                    alt="product"
                  />
                )}
                <div>
                  <h2
                    className={`text-sm font-medium ${
                      product?.title.length > 30 ? "wrap-long-title" : ""
                    }`}
                  >
                    {showingTranslateValue(product?.title)?.substring(0, 28)}
                  </h2>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {showingTranslateValue(product?.category?.name)}
              </span>
            </TableCell>

            <TableCell>{renderVariantsDetail(product)}</TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {currency}{" "}
                {product?.isCombination
                  ? (() => {
                      const firstVariant = product?.variants[0];
                      // Check if it's a size variant with pricing tiers
                      if (
                        firstVariant?.variantType === "size" &&
                        firstVariant?.pricingTiers?.length > 0
                      ) {
                        // Show the product-level original price (cutted price from view page)
                        return getNumberTwo(product?.prices?.originalPrice);
                      }
                      // Traditional variant
                      return getNumberTwo(firstVariant?.originalPrice);
                    })()
                  : getNumberTwo(product?.prices?.originalPrice)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {currency}{" "}
                {product?.isCombination
                  ? (() => {
                      const firstVariant = product?.variants[0];
                      // Check if it's a size variant with pricing tiers
                      if (
                        firstVariant?.variantType === "size" &&
                        firstVariant?.pricingTiers?.length > 0
                      ) {
                        // Show the product-level sale price (from Sale Price field in form)
                        return getNumberTwo(product?.prices?.price);
                      }
                      // Traditional variant
                      return getNumberTwo(firstVariant?.price);
                    })()
                  : getNumberTwo(product?.prices?.price)}
              </span>
            </TableCell>

            <TableCell>
              <Link
                to={`/product/${product._id}`}
                className="flex justify-center text-gray-400 hover:text-emerald-600"
              >
                <Tooltip
                  id="view"
                  Icon={FiZoomIn}
                  title={t("DetailsTbl")}
                  bgColor="#10B981"
                />
              </Link>
            </TableCell>
            <TableCell className="text-center">
              <ShowHideButton id={product._id} status={product.status} />
              {/* {product.status} */}
            </TableCell>
            <TableCell>
              <EditDeleteButton
                id={product._id}
                product={product}
                isCheck={isCheck}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(product?.title)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default ProductTable;
