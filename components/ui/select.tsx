"use client"

import * as BaseSelect from "@base-ui/react/select"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = BaseSelect.Select.Root
const SelectGroup = BaseSelect.Select.Group
const SelectValue = BaseSelect.Select.Value

const SelectTrigger = ({ className, children, ...props }: BaseSelect.Select.Trigger.Props) => (
  <BaseSelect.Select.Trigger
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <BaseSelect.Select.Icon>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </BaseSelect.Select.Icon>
  </BaseSelect.Select.Trigger>
)

const SelectContent = ({ className, children, ...props }: BaseSelect.Select.Popup.Props) => (
  <BaseSelect.Select.Portal>
    <BaseSelect.Select.Positioner sideOffset={4}>
      <BaseSelect.Select.Popup
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
          className
        )}
        {...props}
      >
        <BaseSelect.Select.List className="p-1">{children}</BaseSelect.Select.List>
      </BaseSelect.Select.Popup>
    </BaseSelect.Select.Positioner>
  </BaseSelect.Select.Portal>
)

const SelectLabel = ({ className, ...props }: BaseSelect.Select.GroupLabel.Props) => (
  <BaseSelect.Select.GroupLabel
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
)

const SelectItem = ({ className, children, ...props }: BaseSelect.Select.Item.Props) => (
  <BaseSelect.Select.Item
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <BaseSelect.Select.ItemText>{children}</BaseSelect.Select.ItemText>
    <BaseSelect.Select.ItemIndicator className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <Check className="h-4 w-4" />
    </BaseSelect.Select.ItemIndicator>
  </BaseSelect.Select.Item>
)

const SelectSeparator = ({ className, ...props }: BaseSelect.Select.Separator.Props) => (
  <BaseSelect.Select.Separator className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
)

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
