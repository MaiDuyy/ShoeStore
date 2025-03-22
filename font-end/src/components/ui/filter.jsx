import { shoppingProductFilterOptions } from "@/config";
import React, { Fragment } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

function ProductFilter({ filters, handleFilter }) {
  const renderFilterSection = (key, options) => {
    return (
      <Fragment key={key}>
        <div className="space-y-2">
          <h3 className="text-base font-medium capitalize">{key}</h3>
          <div className="grid gap-2">
            {options.map((option) => {
              const isChecked = filters[key]
                ? filters[key].includes(option.id)
                : false;
              return (
                <Label
                  key={option.id}
                  className="flex items-center gap-2 font-normal cursor-pointer hover:bg-gray-100 p-1 rounded"
                >
                  <Checkbox
                    onCheckedChange={() => handleFilter(key, option.id)}
                    checked={isChecked}
                  />
                  {option.label}
                </Label>
              );
            })}
          </div>
        </div>
        <Separator className="my-4" />
      </Fragment>
    );
  };

  return (
    <div className="rounded-lg shadow-sm bg-background border">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.entries(shoppingProductFilterOptions).map(([key, options]) =>
          renderFilterSection(key, options)
        )}
      </div>
    </div>
  );
}

export default ProductFilter;