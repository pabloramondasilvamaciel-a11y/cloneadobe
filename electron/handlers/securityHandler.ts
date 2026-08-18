import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export class SecurityHandler {
  private algorithm = 'aes-256-cbc';

  private generateKey(password: string): Buffer {
    return crypto.scryptSync(password, 'salt', 32);
  }

  async protectFile(
    filePath: string,
    password: string,
    options: any = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const originalBuffer = fs.readFileSync(filePath);
        const key = this.generateKey(password);
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        let encrypted = cipher.update(originalBuffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        const protectedPath = filePath.replace('.pdf', '.protected.pdf');

        // Save metadata with encrypted file
        const metadata = {
          encrypted: true,
          originalFilename: path.basename(filePath),
          iv: iv.toString('hex'),
          permissions: options.permissions || {
            canPrint: options.canPrint !== false,
            canCopy: options.canCopy !== false,
            canModify: options.canModify !== false
          },
          createdAt: new Date().toISOString()
        };

        const combined = Buffer.concat([
          Buffer.from(JSON.stringify(metadata)),
          Buffer.from('|||SPLIT|||'),
          encrypted
        ]);

        fs.writeFileSync(protectedPath, combined);
        resolve({ success: true, path: protectedPath });
      } catch (error) {
        reject(error);
      }
    });
  }

  async decryptFile(filePath: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const buffer = fs.readFileSync(filePath);
        const content = buffer.toString('utf-8', 0, Math.min(1000, buffer.length));

        if (!content.includes('|||SPLIT|||')) {
          reject(new Error('Invalid protected file format'));
          return;
        }

        const splitIndex = content.indexOf('|||SPLIT|||');
        const metadataStr = buffer.toString('utf-8', 0, splitIndex);
        const metadata = JSON.parse(metadataStr);

        const encryptedStartIndex = splitIndex + '|||SPLIT|||'.length;
        const encrypted = buffer.slice(encryptedStartIndex);

        const key = this.generateKey(password);
        const iv = Buffer.from(metadata.iv, 'hex');

        try {
          const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
          let decrypted = decipher.update(encrypted);
          decrypted = Buffer.concat([decrypted, decipher.final()]);

          resolve({
            success: true,
            data: decrypted.toString('base64'),
            metadata: {
              permissions: metadata.permissions,
              originalFilename: metadata.originalFilename
            }
          });
        } catch (error) {
          reject(new Error('Invalid password'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async verifyPassword(filePath: string, password: string): Promise<boolean> {
    try {
      await this.decryptFile(filePath, password);
      return true;
    } catch {
      return false;
    }
  }

  async removeProtection(filePath: string, password: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const decrypted = await this.decryptFile(filePath, password);
        if (decrypted.success) {
          const unprotectedPath = filePath.replace('.protected.pdf', '.pdf');
          const buffer = Buffer.from(decrypted.data, 'base64');
          fs.writeFileSync(unprotectedPath, buffer);
          resolve({ success: true, path: unprotectedPath });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
