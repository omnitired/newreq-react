
interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export default function LabledInput ({label, id, ...rest}: IProps) {
  return (
    <div>
      <label htmlFor={id} className='text-gray-700 font-bold'>{label}</label>
      <input id={id} className='w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500' {...rest}/>
    </div>
  )
}
