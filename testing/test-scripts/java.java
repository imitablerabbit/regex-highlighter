public class Factorial {
    public int factorial(int num) {
        if (num < 2)
            return 1;
        else
            return factorial(num - 1);
    }
}

"Wrapping"
"Multi-line
wrapping wrong"
/*multi
line comment correct*/
/*multi
line comment with wrapping "hello" correct*/
"Wrapping with --comment inside"
"Wrapping which has been\" escaped "
"Number 1 inside wrapping"
// comment which "has a wrapping"
