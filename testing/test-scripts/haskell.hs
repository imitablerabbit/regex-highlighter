-- GENERAL TESTING
import Text.Printf

criticalProbability :: (Integral a, Floating b) => a -> a -> b
criticalProbability d h
    | h > d     = 1.0 / fromIntegral d * criticalProbability d (h - d)
    | otherwise = 1.0 - fromIntegral (h - 1) / fromIntegral d

main = let
    ds = [4,4,4,4,1,100,8]
    hs = [1,4,5,6,10,200,20]
    in sequence . map (putStrLn . printf "%f") $
        zipWith (\d h -> criticalProbability d h :: Double) ds hs


-- COMMENTS AND STRINGS TESTING
"Wrapping"
"Multi-line
wrapping wrong"
{-multi
line comment correct-}
{-multi
line comment with wrapping "hello" correct-}
"Wrapping with --comment inside"
"Wrapping which has been\" escaped "
"Number 1 inside wrapping"
-- comment which "has a wrapping"
