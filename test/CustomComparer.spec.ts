import CustomComparer from '../src/Comparers/CustomComparer';
import testComparer from './Helpers/testComparer';

const numberComparer = (x: number, y: number) => x - y;
const numberEqualityComparer = (x: number, y: number) => x == y;

const createComparer = () => new CustomComparer(numberComparer, numberEqualityComparer);

const xIsLess: { x: number; y: number; } = { x: -1, y: 10 };
const sameValue: { x: number; y: number; } = { x: -1, y: -1 };
const xIsMore: { x: number; y: number; } = { x: 10, y: -1 };

testComparer("CustomComparer", createComparer, xIsLess, sameValue, xIsMore);