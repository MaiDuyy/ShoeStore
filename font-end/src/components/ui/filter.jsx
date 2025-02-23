import { shoppingProductFilterOptions } from "@/config";
import React, { Fragment } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="rounded-lg shadow-sm bg-neutral-50 bg-background">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(shoppingProductFilterOptions).map((key) => (
          <Fragment key={key}>
            <div className="">
              <h3 className="text-base font-medium">{key}</h3>
              <div className="grid gap-2 mt-2">
                {shoppingProductFilterOptions[key].map((option) => {
                  const isChecked = filters[key]
                    ? filters[key].includes(option.id)
                    : false;
                  return (
                    <Label
                      key={option.id}
                      className="flex items-center gap-2 font-normal"
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
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;