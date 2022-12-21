import { useState } from "react";
import { StringFilter, NumberFilter, DateFilter, EnumFilter } from "./types";

export type StateValue<Data> = { value?: Data, setValue: (v: Data) => any, onClear: () => void }

export function StringFilterForm({ value = { name: 'str', search: '', notInclude: '' }, setValue, onClear }: StateValue<StringFilter>) {
  const [notInclude, setNotInclude] = useState<string>(value.search);
  const [search, setSearch] = useState<string>(value.notInclude);
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setValue({ name: 'str', search, notInclude })
    }}>
      <label>Искать:<input value={search} onChange={(e) => setSearch(e.target.value)} /></label>
      <br/>
      <label>Исключить:<input value={notInclude} onChange={(e) => setNotInclude(e.target.value)} /></label>
      <br />
      <button type="submit">Применить</button>
      <button type="button" onClick={onClear}>Очистить</button>
    </form>
  );
}

export function NumberFilterForm({ value = { name: 'num', from: 0, to: 0 }, setValue, onClear }: StateValue<NumberFilter>) {
  const [from, setFrom] = useState<string>(value.from + '');
  const [to, setTo] = useState<string>(value.to + '');
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setValue({ name: 'num', to: +to, from: +from })
    }}>
      <label>От:<input type="number" max={to} value={from} onChange={(e) => setFrom(e.target.value)} /></label>
      <br />
      <label>До:<input type="number" min={from} value={to} onChange={(e) => setTo(e.target.value)} /></label>
      <br />
      <button type="submit">Применить</button>
      <button type="button" onClick={onClear}>Очистить</button>
    </form>
  );
}

export function DateFilterForm({ value = { name: 'date', from: new Date(), to: new Date() }, setValue, onClear }: StateValue<DateFilter>) {
  const [from, setFrom] = useState<string>(value.from + '');
  const [to, setTo] = useState<string>(value.to + '');
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setValue({ name: 'date', to: new Date(from), from: new Date(to) })
    }}>
      <label>От:<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
      <br />
      <label>До:<input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
      <br />
      <button type="submit">Применить</button>
      <button type="button" onClick={onClear}>Очистить</button>
    </form>
  );
}

export function EnumFilterForm({ value = { name: 'enum', filter: [], values: ['item 1', 'item 2'], }, setValue, onClear }: StateValue<EnumFilter>) {
  const [filter, setFilter] = useState(value.filter);
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setValue({ ...value, filter })
    }}>
      <label>
        Выберите допустимые значения:
        <br />
        <select
          style={{ width: '100%' }}
          multiple
          onChange={({ target }) => {
            setFilter(Array.from(target.options).filter((opt) => opt.selected).map((opt) => opt.value))
          }}
        >
          {value.values?.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <br />
      <button type="submit">Применить</button>
      <button type="button" onClick={onClear}>Очистить</button>
    </form>
  );
}