import React, { useEffect, useState, useMemo, useRef } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useTranslation } from "react-i18next";
import JoditEditor from "jodit-react";

import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import Uploader from "@/components/image-uploader/Uploader";
import DrawerButton from "@/components/form/button/DrawerButton";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import usePageSubmit from "@/hooks/usePageSubmit";

const PageDrawer = ({ id }) => {
  const { t } = useTranslation();
  const editor = useRef(null);
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    published,
    setPublished,
    isSubmitting,
    handleSelectLanguage,
    editorContent,
    setEditorContent,
  } = usePageSubmit(id);

  // Jodit configuration with table and color picker enabled
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start writing your page content...",
      height: "calc(100vh - 300px)",
      minHeight: 500,
      toolbar: true,
      spellcheck: true,
      language: "en",
      toolbarButtonSize: "middle",
      toolbarAdaptive: false,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      // Explicitly enable table and color picker buttons
      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "superscript",
        "subscript",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "font",
        "fontsize",
        "brush", // Color picker button
        "paragraph",
        "|",
        "image",
        "video",
        "table", // Table button
        "link",
        "|",
        "align",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "|",
        "symbol",
        "fullsize",
        "print",
      ],
      // Enable paste from Excel/Word
      pasteHTMLActionList: [
        { value: "insert", text: "Keep" },
        { value: "clean", text: "Clean" },
      ],
    }),
    [],
  );

  // Remove the old handlePastedText function since Jodit handles this natively

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdatePage")}
            description={t("UpdatePageDescription")}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddPage")}
            description={t("AddPageDescription")}
          />
        )}
      </div>

      <Scrollbars className="w-full h-full relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="block h-full">
          <div className="px-6 pt-8 flex-grow scrollbar-hide w-full h-full pb-100">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("PageTitle")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Page Title"
                  name="title"
                  type="text"
                  placeholder={t("PageTitle")}
                />
                <Error errorName={errors.title} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("PageSlug")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Page Slug"
                  name="slug"
                  type="text"
                  placeholder={t("PageSlug")}
                />
                <Error errorName={errors.slug} />
                <span className="text-xs text-gray-500 mt-1 block">
                  URL-friendly version (e.g., about-us, contact-us)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("PageDescription")} />
              <div className="col-span-8 sm:col-span-4">
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                  <JoditEditor
                    ref={editor}
                    value={editorContent}
                    config={config}
                    tabIndex={1}
                    onBlur={(newContent) => setEditorContent(newContent)}
                    onChange={(newContent) => {}}
                  />
                </div>
                <Error errorName={errors.description} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("HeaderBackground")} />
              <div className="col-span-8 sm:col-span-4">
                <Uploader
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  folder="page"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("MetaTitle")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Meta Title"
                  name="metaTitle"
                  type="text"
                  placeholder={t("MetaTitle")}
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  For SEO optimization
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("MetaDescription")} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Meta Description"
                  name="metaDescription"
                  type="text"
                  placeholder={t("MetaDescription")}
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  For SEO optimization
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 h-80">
              <LabelArea label={t("Published")} />
              <div className="col-span-8 sm:col-span-4">
                <SwitchToggle
                  id="published"
                  title=""
                  handleProcess={setPublished}
                  processOption={published}
                />
              </div>
            </div>
          </div>

          <DrawerButton id={id} title="Page" isSubmitting={isSubmitting} />
        </form>
      </Scrollbars>
    </>
  );
};

export default PageDrawer;
