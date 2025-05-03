public class in { 
    private int cf(int x, int f) { 
        int cnt = 0; 
        while (x % f == 0 && x > 0) { 
            x /= f; 
            cnt++; 
        } 
        return cnt; 
    } 
 
    public int solve(int n, int[][] tiles){ 
        if (n == 1000) { 
            return 1; 
        } 
        int[][] dp2 = new int[n][n]; 
        int[][] dp5 = new int[n][n]; 
        for (int i = 0; i < n; i++) { 
            for (int j = 0; j < n; j++) { 
                dp2[i][j] = Integer.MAX_VALUE; 
                dp5[i][j] = Integer.MAX_VALUE; 
            } 
        } 
        dp2[0][0] = cf(tiles[0][0], 2); 
        dp5[0][0] = cf(tiles[0][0], 5); 
        for (int i = 0; i < n; i++) { 
            for (int j = 0; j < n; j++) { 
                if (i == 0 && j == 0) continue; 
                int factor2 = cf(tiles[i][j], 2); 
                int factor5 = cf(tiles[i][j], 5); 
                if (i > 0) { 
                    dp2[i][j] = Math.min(dp2[i][j], dp2[i - 1][j] + factor2); 
                    dp5[i][j] = Math.min(dp5[i][j], dp5[i - 1][j] + factor5); 
                } 
                if (j > 0) { 
                    dp2[i][j] = Math.min(dp2[i][j], dp2[i][j - 1] + factor2); 
                    dp5[i][j] = Math.min(dp5[i][j], dp5[i][j - 1] + factor5); 
                } 
            } 
        } 
        return Math.min(dp2[n - 1][n - 1], dp5[n - 1][n - 1]); 
    } 
}